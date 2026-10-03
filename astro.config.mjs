import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkDirective from 'remark-directive';
import remarkBlocks, { rehypeTableWrap } from './src/lib/remark-blocks.mjs';
import { SITE } from './src/lib/site.mjs';
import rehypeLayout from './src/lib/rehype-layout.mjs';
import fs from 'node:fs';

const images = JSON.parse(fs.readFileSync(new URL('./src/data/images.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: SITE.origin,
  base: SITE.base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkDirective, [remarkBlocks, { base: SITE.base }]],
    rehypePlugins: [rehypeTableWrap, [rehypeLayout, { base: SITE.base, images }]],
  },
});
