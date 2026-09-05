// Title + subtitle for each page that gets a branded OG card. Keyed by URL slug
// ('' = home). Blog posts keep their own hero image as the share image.
export const STATIC_OG: Record<string, { title: string; subtitle: string }> = {
  '': { title: 'Real people film it. Cinebody does the rest.', subtitle: 'The video capture platform that turns your community into your content team.' },
  platform: { title: 'The whole production, run by Cinebody.', subtitle: 'Send a link and Cinebody plans the shoot, coaches every filmer, scores each clip, and hands you the finished video. The people are real.' },
  services: { title: 'Creative Services', subtitle: 'Your content team without the headcount: strategy, creative direction, and editing.' },
  pricing: { title: 'Real content. Real savings.', subtitle: 'Authentic video at a fraction of traditional production costs. Software from $250/month.' },
  work: { title: 'Brands run their video on Cinebody', subtitle: 'Case studies from Nike, Royal Caribbean, Dell, and more.' },
  'knowledge-base': { title: 'Knowledge Base', subtitle: 'Guides, answers, and best practices for using Cinebody.' },
  patents: { title: 'Patents', subtitle: 'The patented technology behind capturing authentic video at scale.' },
  // case studies
  'royal-caribbean': { title: 'Royal Caribbean × Cinebody', subtitle: 'Turned onboard crew across the fleet into an always-on content engine.' },
  pointme: { title: 'Point.me × Cinebody', subtitle: 'One shoot produced a connected-TV spot plus a campaign featuring 70+ real customers.' },
  nike: { title: 'Nike × Cinebody', subtitle: 'Captured authentic athlete and community video at the speed of culture.' },
  dell: { title: 'Dell × Cinebody', subtitle: 'Scaled authentic employee and event video across teams and geographies.' },
  'georgia-pacific': { title: 'Georgia-Pacific × Cinebody', subtitle: 'Captured employee stories and brand video across a distributed workforce.' },
  altra: { title: 'Altra × Cinebody', subtitle: 'Captured athlete stories on the trail and turned them into a season of content.' },
  cogent: { title: 'Cogent × Cinebody', subtitle: 'Captured real festival and event footage and produced a marquee brand film.' },
  crocs: { title: 'Crocs × Cinebody', subtitle: 'Ran a high-volume campaign of authentic creator and customer video.' },
  sploot: { title: 'Sploot × Cinebody', subtitle: 'Shot once and produced a connected-TV spot plus a full set of social cutdowns.' },
};

// file slug used in /og/<fileSlug>.png (home has no URL slug)
export const ogFileSlug = (urlSlug: string) => urlSlug || 'home';
export const hasOG = (urlSlug: string) => urlSlug in STATIC_OG;
