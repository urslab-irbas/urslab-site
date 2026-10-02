// Годишни страници с публикации; всяка публикация е на страницата за годината си (раздел „Архив“ в „Публикации“).
// Публикациите, въведени през формата на сайта, са в contrib.json и се разпределят тук по година;
// за година без страница (напр. 2027) страницата се създава автоматично (маршрут: src/pages/publications/[key].astro).
import { archive as archive2022, type ArchivePub } from './archive2022';
import { archive2025 } from './archive2025';
import { archive2026 } from './archive2026';
import { archiveEarlier } from './archiveEarlier';
import contrib from './contrib.json';
import { parseAuthors, teamFromAuthors, composeVenue } from '../lib/pubSchema.js';

type L = { bg: string; en: string };
export interface ArchivePage { key: string; slug: string; title: L; source?: L; items: ArchivePub[] }

const BAS: L = {
  bg: 'Източник: отчет на БАН „Всички публикации – публикувани“ (звено ИР), 02.10.2026. „Дял ИР“ = сума от процента автори от Института по роботика.',
  en: 'Source: BAS report “All publications – published” (IR unit), 2 Oct 2026. “IR share” = sum of the percentage of authors from the Institute of Robotics.',
};

const fixed: ArchivePage[] = [
  { key: '2026', slug: 'publications/2026', title: { bg: 'Публикации 2026 г.', en: 'Publications 2026' }, source: BAS, items: archive2026 },
  { key: '2025', slug: 'publications/2025', title: { bg: 'Публикации 2025 г.', en: 'Publications 2025' }, source: BAS, items: archive2025 },
  { key: '2022-2024', slug: 'publications/2022-2024', title: { bg: 'Публикации 2022 – 2024 г.', en: 'Publications 2022 – 2024' }, items: archive2022 },
  { key: 'earlier', slug: 'publications/earlier', title: { bg: 'Публикации до 2021 г.', en: 'Publications up to 2021' }, items: archiveEarlier },
];

// Въведени през формата (contrib.json) → формат ArchivePub
type Contrib = { year: number; cat: ArchivePub['cat']; authors: string; title: string; doi?: string; isbn?: string; sjr?: number; jif?: number; share?: number; tags: string[]; [k: string]: unknown };
const fromForm: ArchivePub[] = (contrib as Contrib[]).map((e) => ({
  year: e.year, cat: e.cat, authors: e.authors, title: e.title, venue: composeVenue(e), doi: e.doi, isbn: e.isbn,
  sjr: e.sjr, jif: e.jif, share: e.share, tags: e.tags, team: teamFromAuthors(parseAuthors(e.authors).list),
}));

const pageKey = (y: number) => (y <= 2021 ? 'earlier' : y <= 2024 ? '2022-2024' : String(y));
for (const p of fromForm) {
  const key = pageKey(p.year);
  let page = fixed.find((x) => x.key === key);
  if (!page) {
    page = { key, slug: `publications/${key}`, title: { bg: `Публикации ${key} г.`, en: `Publications ${key}` }, items: [] };
    fixed.push(page);
  }
  page.items = [...page.items, p];
}

// Ред под „Архив“: най-новата година първа, „до 2021 г.“ последна
const order = (k: string) => (k === 'earlier' ? 0 : Number(k.slice(0, 4)) + (k.length > 4 ? 0 : 0.5));
export const archivePages: ArchivePage[] = fixed.sort((a, b) => order(b.key) - order(a.key));
