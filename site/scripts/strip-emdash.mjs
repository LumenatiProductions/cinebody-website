// Shared em-dash remover + a one-time pass over source/authored files.
// Em dashes are banned everywhere in copy and markup. The appositive em dash
// these pages use is replaced with a comma; a tag-adjacent one is just dropped.
// prep-fragments.mjs and gen-pages.mjs import stripEmDash so every sync stays clean.
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SP = '(?:[ \\t]|&nbsp;|\\u00a0)'; // space, tab, or nbsp (never a newline)

export function stripEmDash(s, { html = false } = {}) {
  if (html) {
    // A tag-adjacent em dash would leave a leading comma in the text node,
    // so drop it entirely down to ">text".
    s = s.replace(new RegExp(`>${SP}*\\u2014${SP}*`, 'g'), '>');
  }
  // The appositive em dash ("phrase EMDASH elaboration") becomes a comma.
  s = s.replace(new RegExp(`${SP}*\\u2014${SP}*`, 'g'), ', ');
  return s;
}

// ---- one-time CLI pass -------------------------------------------------------
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const ROOT = path.resolve(import.meta.dirname, '..');
  const REPO = path.resolve(ROOT, '..');
  const { globSync } = await import('node:fs');
  const targets = [
    ...globSync('v2/paste-ready/*.html', { cwd: REPO }).map((f) => [path.join(REPO, f), true]),
    ...globSync('v2/paste-ready/*.{css,js,md}', { cwd: REPO }).map((f) => [path.join(REPO, f), false]),
    ...globSync('site/src/**/*.{astro,css}', { cwd: REPO }).map((f) => [path.join(REPO, f), true]),
    ...globSync('site/scripts/{prep-fragments,gen-pages}.mjs', { cwd: REPO }).map((f) => [path.join(REPO, f), false]),
    [path.join(REPO, 'site/README.md'), false],
  ];
  let changed = 0;
  for (const [file, html] of targets) {
    if (!existsSync(file)) continue;
    const before = await readFile(file, 'utf8');
    if (!/\u2014/.test(before)) continue;
    const after = stripEmDash(before, { html });
    if (after !== before) { await writeFile(file, after); changed++; console.log('  cleaned', path.relative(REPO, file)); }
  }
  console.log(`\n${changed} file(s) cleaned of em dashes.`);
}
