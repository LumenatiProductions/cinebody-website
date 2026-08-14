import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.cinebody.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory', // /software/index.html -> served at /software
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/boeing') && !page.includes('/giin') && !page.includes('/gilead-cds') && !page.includes('/kc-current'),
    }),
  ],
  compressHTML: true,
});
