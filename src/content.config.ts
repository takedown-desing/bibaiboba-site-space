import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    url: z.string(),
    slug: z.string(),
    type: z.string(),
    title: z.string(),
    description: z.string(),
    h1: z.string(),
  }).passthrough(),
});

export const collections = { pages };
