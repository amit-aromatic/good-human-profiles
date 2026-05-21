import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const SITE_ORIGIN = process.env.PRERENDER_ORIGIN || 'http://localhost:5173';
const SITEMAP_PATH = process.env.PRERENDER_SITEMAP || 'public/sitemap.txt';
const OUTPUT_DIR = process.env.PRERENDER_OUTPUT_DIR || 'docs';

function normalizeRoute(urlString) {
  const url = new URL(urlString);
  let routePath = url.pathname;

  if (routePath === '/') {
    return 'index.html';
  }

  routePath = routePath.replace(/\/+$/, '');
  const segments = routePath.split('/').filter(Boolean);
  return path.join(...segments.slice(0, -1) , segments.slice(-1)+'.html');
}

async function main() {
  const sitemapContent = await readFile(SITEMAP_PATH, 'utf8');
  const routes = sitemapContent
    .split(/\r?\n/)
    .map((line) => line.trim().replace('https://the.goodhuman.in', ''))
    .filter(Boolean)
    .filter((line) => line !== '/');

  if (routes.length === 0) {
    console.log(`No routes found in ${SITEMAP_PATH}`);
    return;
  }

  const browser = await puppeteer.launch({
    headless: 'new',
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    for (const route of routes) {
      const url = new URL(route, SITE_ORIGIN).toString();
      await page.goto(url, { waitUntil: 'networkidle0' });
      const html = await page.content();
      const outputPath = path.join(OUTPUT_DIR, normalizeRoute(url));
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, html, 'utf8');
      console.log(`Wrote ${outputPath}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
