import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: "https://yttd.fr",
  integrations: [sitemap()],
  prefetch: {
    defaultStrategy: "viewport",
    prefetchAll: true,
  },
});
