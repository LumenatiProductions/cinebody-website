// Build a schema.org FAQPage from a fragment's on-page FAQ (.faq-item > .faq-q / .faq-a-inner),
// so the questions we already answer on the page can surface as rich results and get
// quoted by AI search engines. Runs at build time only.
import { parse } from 'node-html-parser';

export function faqSchema(html: string) {
  const root = parse(html);
  const items = root.querySelectorAll('.faq-item').map((item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a-inner');
    if (!q || !a) return null;
    q.querySelectorAll('.faq-icon').forEach((n) => n.remove());
    const question = q.text.replace(/\s+/g, ' ').trim();
    const answer = a.text.replace(/\s+/g, ' ').trim();
    if (!question || !answer) return null;
    return {
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    };
  }).filter(Boolean);
  if (!items.length) return null;
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items };
}
