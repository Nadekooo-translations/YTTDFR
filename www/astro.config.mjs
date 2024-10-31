import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: "https://yttd.fr",
  integrations: [sitemap(), vue({devtools: true})],
  prefetch: {
    defaultStrategy: "viewport",
    prefetchAll: true,
  },
});