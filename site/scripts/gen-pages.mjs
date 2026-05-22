// Generates src/pages/*.astro — each is a thin wrapper that injects the
// matching fragment into the Base layout. Re-runnable; overwrites pages.
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'src/pages');

// route file (no ext) -> { fragment, title, active, description, noindex }
const pages = [
  { route: 'index', fragment: 'homepage', active: 'home',
    description: 'Cinebody is the video capture platform that turns your community into your content team. Direct authentic UGC at scale — from anyone, anywhere.' },
  { route: 'software', fragment: 'software', title: 'Software', active: 'software',
    description: 'The Cinebody platform: send a creative brief, and your people capture pro-quality vertical video on their phones. Review, manage, and publish at scale.' },
  { route: 'services', fragment: 'services', title: 'Creative Services', active: 'services',
    description: 'Your content team, without the headcount. Cinebody Creative Services handles strategy, direction, and editing so you ship great video, fast.' },
  { route: 'pricing', fragment: 'pricing', title: 'Pricing', active: 'pricing',
    description: 'Simple plans for the Cinebody software platform and creative services. Find the right fit for your team and start capturing authentic video.' },
  { route: 'royal-caribbean', fragment: 'royal-caribbean', title: 'Royal Caribbean Case Study',
    description: 'How Royal Caribbean used Cinebody to capture authentic guest and crew stories at sea — turning real moments into scroll-stopping brand content.' },
  { route: 'pointme', fragment: 'pointme', title: 'Point.me Case Study',
    description: 'How Point.me used Cinebody to produce a steady stream of customer and expert video that drives signups and trust.' },
  { route: 'nike', fragment: 'nike', title: 'Nike Case Study',
    description: 'How Nike tapped Cinebody to capture authentic athlete and community video at the speed of culture.' },
  { route: 'georgia-pacific', fragment: 'georgia-pacific', title: 'Georgia-Pacific Case Study',
    description: 'How Georgia-Pacific used Cinebody to capture employee stories and brand video across a distributed workforce.' },
  { route: 'dell', fragment: 'dell', title: 'Dell Case Study',
    description: 'How Dell used Cinebody to scale authentic employee and event video across teams and geographies.' },
  { route: 'altra', fragment: 'altra', title: 'Altra Case Study',
    description: 'How Altra Running used Cinebody to capture athlete stories on the trail and turn them into a season of content.' },
  { route: 'cogent', fragment: 'cogent', title: 'Cogent Case Study',
    description: 'How Cogent used Cinebody to capture real festival and event footage and produce a marquee brand film.' },
  { route: 'crocs', fragment: 'crocs', title: 'Crocs Case Study',
    description: 'How Crocs used Cinebody to capture a high-volume campaign of authentic creator and customer video.' },
  { route: 'sploot', fragment: 'sploot', title: 'Sploot Case Study',
    description: 'How Sploot used Cinebody to shoot once and produce a connected-TV spot plus a full set of social cutdowns.' },
  { route: 'knowledge-base', fragment: 'knowledge-base', title: 'Knowledge Base', active: 'knowledge-base',
    description: 'Guides, answers, and best practices for getting the most out of Cinebody.' },
  { route: 'patents', fragment: 'patents', title: 'Patents',
    description: 'Cinebody patent information.' },
  { route: 'privacy-policy', fragment: 'privacy-policy', title: 'Privacy Policy',
    description: 'How Cinebody collects, uses, and protects your information.' },
  { route: 'terms-of-service', fragment: 'terms-of-service', title: 'Terms of Service',
    description: 'The terms that govern your use of Cinebody.' },
  { route: 'create-projects', fragment: 'create-projects', title: 'Create Projects',
    description: 'Learn how to create and launch a project in Cinebody.' },
  { route: 'android', fragment: 'android', title: 'Android Tutorial',
    description: 'How to capture and upload video with Cinebody on Android.' },
  { route: '404', fragment: '404', title: 'Page Not Found', noindex: true,
    description: "The page you're looking for can't be found." },
];

function astro({ fragment, title, active, description, noindex }) {
  const props = [];
  if (title) props.push(`title="${title}"`);
  if (active) props.push(`active="${active}"`);
  if (description) props.push(`description="${description.replace(/"/g, '&quot;')}"`);
  if (noindex) props.push('noindex={true}');
  return `---
import Base from '../layouts/Base.astro';
import body from '../fragments/${fragment}.html?raw';
---
<Base ${props.join(' ')}>
  <Fragment set:html={body} />
</Base>
`;
}

for (const p of pages) {
  await writeFile(path.join(OUT, `${p.route}.astro`), astro(p));
  console.log('  page', `${p.route}.astro`, '->', `${p.fragment}.html`);
}
console.log(`\n${pages.length} pages generated.`);
