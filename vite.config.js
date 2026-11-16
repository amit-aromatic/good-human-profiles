import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds sitemap.xml from public/sitemap.txt (the single source of URLs,
// also used by scripts/prerender.mjs).
function sitemapXml() {
  return {
    name: 'sitemap-xml',
    apply: 'build',
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10);
      const urls = readFileSync('public/sitemap.txt', 'utf8')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const entries = urls
        .map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), sitemapXml()],
  server: {
    host: '0.0.0.0'
  },
  publicDir: 'public',
  build: {
    outDir: 'docs',
    emptyOutDir: true
  },
});
