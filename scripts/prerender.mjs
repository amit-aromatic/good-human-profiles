import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const SITE_ORIGIN = process.env.PRERENDER_ORIGIN || 'http://localhost:5173';
const SITEMAP_PATH = process.env.PRERENDER_SITEMAP || 'public/sitemap.txt';
const OUTPUT_DIR = process.env.PRERENDER_OUTPUT_DIR || 'docs';

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveExecutablePath() {
  const customPath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (customPath && await fileExists(customPath)) {
    return customPath;
  }

  const defaultPath = puppeteer.executablePath();
  if (defaultPath && await fileExists(defaultPath)) {
    return defaultPath;
  }

  if (process.platform === 'win32') {
    const candidates = [
      process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      process.env['PROGRAMFILES(X86)'] && path.join(process.env['PROGRAMFILES(X86)'], 'Google', 'Chrome', 'Application', 'chrome.exe'),
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    ].filter(Boolean);

    for (const candidate of candidates) {
      if (await fileExists(candidate)) {
        return candidate;
      }
    }
  }

  return undefined;
}

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

  const executablePath = await resolveExecutablePath();
  const launchOptions = { headless: 'new' };

  if (executablePath) {
    console.log(`Launching Chromium/Chrome from: ${executablePath}`);
    launchOptions.executablePath = executablePath;
  } else {
    console.warn('No valid Chrome executable found. Puppeteer will attempt to use its bundled browser.');
  }

  const browser = await puppeteer.launch(launchOptions);

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

    const indexPath = path.join(OUTPUT_DIR, 'index.html');
    const notFoundPath = path.join(OUTPUT_DIR, '404.html');
    await copyFile(indexPath, notFoundPath);
    console.log(`Copied ${indexPath} to ${notFoundPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
