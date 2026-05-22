import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    pubDate: z.coerce.date(),
    author: z.string().default('Cinebody'),
    heroImage: z.string().optional(),
    cardImage: z.string().optional(),
    // Manual crop focal point "x y" (0..1, e.g. "0.5 0.3"). Applied by
    // scripts/recrop-blog.mjs; omit to use the default smart crop.
    focal: z.string().optional(),
  }),
});

export const collections = { blog };
