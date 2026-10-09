import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Страници, които не трябва да са в картата на сайта за търсачките (формата за въвеждане, 404).
const NOT_IN_SITEMAP = ['/404/', '/publications/new/', '/en/publications/new/'];

export default defineConfig({
  site: 'https://urs.ir.bas.bg',
  trailingSlash: 'always',
  integrations: [
    // Карта на сайта (sitemap-index.xml) за Google / Bing; всяка страница сочи и езиковата си двойка (hreflang).
    sitemap({
      filter: (page) => !NOT_IN_SITEMAP.some((p) => new URL(page).pathname === p),
      i18n: { defaultLocale: 'bg', locales: { bg: 'bg', en: 'en' } },
    }),
  ],
});
