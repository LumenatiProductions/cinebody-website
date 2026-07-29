#!/usr/bin/env node
// qa-kit — the QA ledger CLI, vendored per repo. Zero dependencies.
// Generalized from cinebody-platform's qa/qa.mjs (the proving system).
//
//   node qa/qa.mjs status                     latest result per check, staleness flagged
//   node qa/qa.mjs record <id> <pass|fail|blocked> [--mode e2e|chrome|human] [--runner name] [--notes "..."]
//   node qa/qa.mjs history <id>               full result history for one check
//   node qa/qa.mjs suspects <id>              commits touching the check's code paths since its last pass
//   node qa/qa.mjs import <report.json>       record results from a Playwright JSON report
//                                             (alias: import-e2e, for existing CI wiring)
//   node qa/qa.mjs render [out.html]          write the shareable QA board (default: qa-status.html)
//
// Data model (the qa/ contract): qa/registry.json is the product inventory —
// every check is a claim with who/states/limits, a drivability tier
// (full/partial/human — legacy field name "chrome" honored), coverage refs to
// the automated specs (legacy "e2e" honored), and code_paths. qa/ledger.jsonl
// is the append-only memory of every result. `suspects` joins the two via git.
// Optional registry top-level "config": { "product": "...", "staleDays": 14 }.
//
// QA_KIT_DIR env var overrides the qa directory (testing / cross-repo runs).

import { readFileSync, appendFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const QA_DIR = process.env.QA_KIT_DIR || dirname(fileURLToPath(import.meta.url));
const LEDGER = join(QA_DIR, 'ledger.jsonl');

function git(args, cwd = QA_DIR) {
  try {
    return execSync(`git ${args}`, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
}

const REPO = git('rev-parse --show-toplevel') || join(QA_DIR, '..');

const reg = JSON.parse(readFileSync(join(QA_DIR, 'registry.json'), 'utf8'));
const registry = reg.checks;
const config = reg.config ?? {};
const STALE_DAYS = config.staleDays ?? 14;
const byId = Object.fromEntries(registry.map((c) => [c.id, c]));

// Field aliases keep pre-kit registries (cinebody-platform) working unchanged.
const tierOf = (c) => c.tier ?? c.chrome ?? 'human';
const coverageOf = (c) => c.coverage ?? c.e2e ?? [];

function ledger() {
  if (!existsSync(LEDGER)) return [];
  return readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

function append(entry) {
  appendFileSync(LEDGER, JSON.stringify(entry) + '\n');
}

function requireCheck(id) {
  const check = byId[id];
  if (!check) {
    console.error(`unknown check "${id}" — ids live in qa/registry.json`);
    process.exit(1);
  }
  return check;
}

function flag(name, argv) {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
}

function latestPerCheck() {
  const latest = {};
  for (const e of ledger()) latest[e.id] = e;
  return latest;
}

const STATUS_GLYPH = { pass: 'PASS', fail: 'FAIL', blocked: 'BLKD' };

const [cmd, ...argv] = process.argv.slice(2);

if (cmd === 'record') {
  const [id, status] = argv;
  const check = requireCheck(id);
  if (!['pass', 'fail', 'blocked'].includes(status)) {
    console.error('status must be pass | fail | blocked');
    process.exit(1);
  }
  const entry = {
    id,
    status,
    mode: flag('mode', argv) ?? 'human',
    runner: flag('runner', argv) ?? git('config user.name', REPO) ?? 'unknown',
    notes: flag('notes', argv) ?? '',
    commit: git('rev-parse --short HEAD', REPO) || null,
    at: new Date().toISOString(),
  };
  append(entry);
  console.log(`recorded ${id} ${status} (${entry.mode}) @ ${entry.commit} — ${check.title}`);
} else if (cmd === 'status') {
  const latest = latestPerCheck();
  const now = Date.now();
  let section = '';
  for (const c of registry) {
    if (c.section !== section) {
      section = c.section;
      console.log(`\n${section}`);
    }
    const e = latest[c.id];
    const cover = [coverageOf(c).length ? `cov:${coverageOf(c).length}` : null, `tier:${tierOf(c)}`, c.device ? `dev:${c.device}` : null]
      .filter(Boolean)
      .join(' ');
    if (!e) {
      console.log(`  ${c.id.padEnd(5)} ----  never run           ${c.title}  [${cover}]`);
      continue;
    }
    const days = Math.floor((now - Date.parse(e.at)) / 86400000);
    const stale = days > STALE_DAYS ? ` STALE ${days}d` : ` ${days}d ago`;
    console.log(`  ${c.id.padEnd(5)} ${STATUS_GLYPH[e.status]}  ${e.mode.padEnd(6)}${stale.padEnd(12)} ${c.title}`);
  }
  const entries = ledger();
  const fails = Object.values(latestPerCheck()).filter((e) => e.status === 'fail');
  console.log(`\n${entries.length} ledger entries · ${registry.length} checks · ${fails.length} currently failing`);
  if (fails.length) console.log(`failing: ${fails.map((e) => e.id).join(', ')} — run \`qa.mjs suspects <id>\``);
} else if (cmd === 'history') {
  const check = requireCheck(argv[0]);
  console.log(`${check.id} — ${check.title}\n`);
  const rows = ledger().filter((e) => e.id === check.id);
  if (!rows.length) console.log('never recorded');
  for (const e of rows) {
    console.log(`${e.at}  ${STATUS_GLYPH[e.status]}  ${e.mode.padEnd(6)} ${(e.commit ?? '-------').padEnd(8)} ${e.runner}${e.notes ? `  — ${e.notes}` : ''}`);
  }
} else if (cmd === 'suspects') {
  const check = requireCheck(argv[0]);
  const rows = ledger().filter((e) => e.id === check.id);
  const lastPass = [...rows].reverse().find((e) => e.status === 'pass' && e.commit);
  const paths = (check.code_paths ?? []).join(' ');
  console.log(`${check.id} — ${check.title}`);
  if (!paths) {
    console.log('no code_paths declared for this check — add them in registry.json to enable suspects.');
    process.exit(0);
  }
  console.log(`code paths: ${check.code_paths.join(', ')}\n`);
  if (lastPass) {
    console.log(`last recorded pass: ${lastPass.commit} (${lastPass.at}, ${lastPass.mode}, ${lastPass.runner})`);
    const log = git(`log --oneline ${lastPass.commit}..HEAD -- ${paths}`, REPO);
    const files = git(`diff --name-only ${lastPass.commit}..HEAD -- ${paths}`, REPO);
    if (!log) {
      console.log('no commits have touched this feature since it last passed — suspect the environment, data, or an upstream service, not this code.');
    } else {
      console.log(`\ncommits touching this feature since then:\n${log}`);
      console.log(`\nfiles changed:\n${files}`);
    }
  } else {
    console.log('no recorded pass with a commit — showing the last 15 commits touching this feature:\n');
    console.log(git(`log --oneline -15 -- ${paths}`, REPO));
  }
} else if (cmd === 'import' || cmd === 'import-e2e') {
  const report = JSON.parse(readFileSync(argv[0], 'utf8'));
  const specs = [];
  (function walk(suite, file) {
    for (const s of suite.suites ?? []) walk(s, s.file ?? file);
    for (const spec of suite.specs ?? []) {
      // A skipped spec still reports ok:true in Playwright JSON — it must not
      // count as a pass (or a fail). Track the outcome, not just spec.ok.
      const statuses = (spec.tests ?? []).map((t) => t.status);
      const skipped = statuses.length > 0 && statuses.every((s) => s === 'skipped');
      specs.push({ file: spec.file ?? file, title: spec.title, ok: spec.ok, skipped });
    }
  })({ suites: report.suites ?? [] }, '');
  let recorded = 0;
  let skippedChecks = 0;
  for (const check of registry) {
    const refs = coverageOf(check);
    if (!refs.length) continue;
    const matched = [];
    for (const ref of refs) {
      const [file, title] = ref.split('::');
      matched.push(...specs.filter((s) => s.file.endsWith(file) && s.title.includes(title) && !s.skipped));
    }
    if (!matched.length) {
      // Every covering spec was skipped or absent — no evidence either way.
      if (refs.some((ref) => specs.some((s) => s.file.endsWith(ref.split('::')[0]) && s.title.includes(ref.split('::')[1])))) skippedChecks++;
      continue;
    }
    const status = matched.every((s) => s.ok) ? 'pass' : 'fail';
    append({
      id: check.id,
      status,
      mode: 'e2e',
      runner: 'playwright',
      notes: `${matched.filter((s) => s.ok).length}/${matched.length} covering tests passed`,
      commit: git('rev-parse --short HEAD', REPO) || null,
      at: new Date().toISOString(),
    });
    recorded++;
    if (status === 'fail') console.log(`FAIL ${check.id} — ${check.title}: ${matched.filter((s) => !s.ok).map((s) => s.title).join('; ')}`);
  }
  console.log(`recorded ${recorded} checks from ${specs.length} e2e results${skippedChecks ? ` (${skippedChecks} checks skipped — covering tests did not run)` : ''}`);
} else if (cmd === 'render') {
  const out = argv[0] ?? join(QA_DIR, 'qa-status.html');
  const latest = latestPerCheck();
  const now = Date.now();
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const counts = { pass: 0, fail: 0, blocked: 0, never: 0, stale: 0 };
  const sections = new Map();
  for (const c of registry) {
    const e = latest[c.id];
    const days = e ? Math.floor((now - Date.parse(e.at)) / 86400000) : null;
    const state = !e ? 'never' : e.status;
    counts[state]++;
    if (e && days > STALE_DAYS && e.status === 'pass') counts.stale++;
    if (!sections.has(c.section)) sections.set(c.section, []);
    sections.get(c.section).push({ c, e, days, state });
  }
  const color = { pass: '#7FB069', fail: '#D98A7B', blocked: '#D9A441', never: '#8B8371' };
  let rows = '';
  for (const [section, items] of sections) {
    rows += `<h2>${esc(section)}</h2><table>`;
    for (const { c, e, days, state } of items) {
      const age = e ? (days > STALE_DAYS ? `STALE ${days}d` : `${days}d ago`) : 'never run';
      const note = e?.notes ? ` title="${esc(e.notes)}"` : '';
      rows += `<tr${note}><td class="id">${esc(c.id)}</td><td class="st" style="color:${color[state]}">${esc(state.toUpperCase())}</td>` +
        `<td class="age">${esc(age)}</td><td>${esc(c.title)}</td><td class="tier">${esc(tierOf(c))}${c.device ? ` · ${esc(c.device)}` : ''}</td></tr>`;
    }
    rows += '</table>';
  }
  const html = `<!doctype html><meta charset="utf-8"><title>${esc(config.product ?? 'QA')} — QA status</title><style>
  body{background:#0C0C0C;color:#F0E6CF;font:14px/1.5 "Helvetica Neue",system-ui,sans-serif;max-width:960px;margin:0 auto;padding:32px 20px}
  h1{font-size:22px}h2{font-size:14px;margin:26px 0 6px;color:#C4762B;text-transform:uppercase;letter-spacing:.08em}
  .sum{color:#8B8371;font-family:ui-monospace,monospace;font-size:12px;margin-top:6px}
  table{border-collapse:collapse;width:100%}td{padding:5px 10px;border-bottom:1px solid rgba(240,230,207,.08)}
  .id,.st,.age,.tier{font-family:ui-monospace,monospace;font-size:12px;white-space:nowrap}.age,.tier{color:#8B8371}
  </style><h1>${esc(config.product ?? 'QA')} — QA status</h1>
  <div class="sum">${registry.length} checks · ${counts.pass} pass · ${counts.fail} fail · ${counts.blocked} blocked · ${counts.never} never run · ${counts.stale} stale · rendered ${new Date().toISOString().slice(0, 16)}Z</div>${rows}`;
  writeFileSync(out, html);
  console.log(`wrote ${out} (${registry.length} checks, ${counts.fail} failing, ${counts.never} never run)`);
} else {
  console.log('usage: qa.mjs status | record <id> <pass|fail|blocked> | history <id> | suspects <id> | import <report.json> | render [out.html]');
  process.exit(cmd ? 1 : 0);
}
