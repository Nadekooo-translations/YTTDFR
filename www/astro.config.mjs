import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import vue from "@astrojs/vue";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://yttd.fr",
  integrations: [sitemap(), vue({devtools: true}), mdx()],
  prefetch: {
    defaultStrategy: "viewport",
    prefetchAll: true,
  },
});