// @ts-check
import { defineConfig } from 'astro/config';

// Static output: `npm run build` writes plain HTML/CSS/JS to `dist/`, served by GitHub Pages
// at https://quitehandy.app (public/CNAME).
const site = process.env.SITE_URL ?? 'https://quitehandy.app';
const base = process.env.SITE_BASE ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // /download → dist/download/index.html (works on every static host)
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
});
