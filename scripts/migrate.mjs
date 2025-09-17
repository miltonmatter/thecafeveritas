import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import fs from 'node:fs';
import path from 'node:path';
import slugify from 'slugify';

const KNOWN_URLS = [
  'https://thecafeveritas.org/',
  'https://thecafeveritas.org/events',
  'https://thecafeveritas.org/about-us/our-vision',
  'https://thecafeveritas.org/about-us/leadership',
  'https://thecafeveritas.org/past-topics',
  'https://thecafeveritas.org/past-topics/art',
  'https://thecafeveritas.org/past-topics/culture',
  'https://thecafeveritas.org/past-topics/shame',
  'https://thecafeveritas.org/past-topics/racism',
  'https://thecafeveritas.org/past-topics/social-justice',
  'https://thecafeveritas.org/past-topics/signposts',
  'https://thecafeveritas.org/past-topics/urban-planning',
  'https://thecafeveritas.org/past-topics/music',
  'https://thecafeveritas.org/past-topics/agriculture'
];

const outDir = path.join(process.cwd(), 'src', 'pages', '_imported');
fs.mkdirSync(outDir, { recursive: true });

const turndown = new TurndownService({ headingStyle: 'atx' });

function chooseTitle(document) {
  const og = document.querySelector('meta[property="og:title"]')?.content;
  const h1 = document.querySelector('h1')?.textContent?.trim();
  const title = og || h1 || document.title || 'Untitled';
  return title.replace(/\s+\|\s+.*$/, '').trim();
}

function pickMain(document) {
  const main = document.querySelector('main');
  if (main) return main;
  return document.body;
}

for (const url of KNOWN_URLS) {
  try {
    console.log('Fetching', url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const document = dom.window.document;

    let article;
    try {
      const reader = new Readability(document);
      article = reader.parse();
    } catch (e) {
      article = null;
    }

    const title = article?.title || chooseTitle(document);
    const contentHTML = article?.content || pickMain(document).innerHTML;
    const md = turndown.turndown(contentHTML);
    const slug = slugify(title, { lower: true, strict: true });

    const frontmatter = [
      `---`,
      `title: "${title.replace(/"/g, '\"')}"`,
      `source_url: "${url}"`,
      `---`,
      ``
    ].join('\n');

    const outPath = path.join(outDir, `${slug || 'page'}.md`);
    fs.writeFileSync(outPath, frontmatter + md, 'utf8');
    console.log('Saved', outPath);
  } catch (err) {
    console.error('Error on', url, err.message);
  }
}

console.log('Done. Review files in src/pages/_imported/');
