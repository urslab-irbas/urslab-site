// Годишни страници с публикации; всяка публикация е на страницата за годината си (раздел „Архив“ в „Публикации“).
// Публикациите, въведени през формата на сайта, са в contrib.json и се разпределят тук по година;
// за година без страница (напр. 2027) страницата се създава автоматично (маршрут: src/pages/publications/[key].astro).
import { archive as archive2022, type ArchivePub } from './archive2022';
import { archive2025 } from './archive2025';
import { archive2026 } from './archive2026';
import { archiveEarlier } from './archiveEarlier';
import contrib from './contrib.json';
import { publications } from './publications';
import { nrsFor } from './nrs';
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
const mapForm = (e: Contrib): ArchivePub => ({
  year: e.year, cat: e.cat, authors: e.authors, title: e.title, venue: composeVenue(e), doi: e.doi, isbn: e.isbn,
  sjr: e.sjr, jif: e.jif, share: e.share, tags: e.tags, team: teamFromAuthors(parseAuthors(e.authors).list),
});
// Подадените (cat 'sub') са в текущия списък на „Публикации“, а не в архива
export const formSubmitted: ArchivePub[] = (contrib as Contrib[]).filter((e) => e.cat === 'sub').map(mapForm);
const fromForm: ArchivePub[] = (contrib as Contrib[]).filter((e) => e.cat !== 'sub').map(mapForm);

// Фамилия (в publications.ts авторите са „A. Madzharov“) → ключ на член от колектива
const surname: [RegExp, string][] = [
  [/Madzharov|Madjarov/i, 'madzharov'], [/Ale[kx]s?androv/i, 'aleksandrov'], [/\bN\.?\s*Chehlarova|Chehlarova,?\s*N\b/i, 'chehlarova'],
  [/Gaidarski/i, 'gaidarski'], [/Hristozov/i, 'hristozov'], [/\bR\.?\s*Georgiev|Georgiev,?\s*R\b/i, 'georgiev'],
];
export const teamOf = (authors: string[]) => [...new Set(authors.flatMap((a) => surname.filter(([re]) => re.test(a)).map(([, k]) => k)))];
export const fromPublication = (p: (typeof publications)[number]): ArchivePub => ({
  year: p.year, cat: p.status !== 'published' ? 'sub' : p.tags.includes('software') ? 'soft' : 'other',
  authors: p.authors.join(', '), title: p.title, venue: p.venue, doi: p.doi, url: p.url, team: teamOf(p.authors), tags: p.tags,
});
// Излезлите от печат (status 'published') от текущия списък отиват в архива по година
const norm = (t: string) => t.toLowerCase().replace(/[^a-zа-я0-9]/gi, '');
const known = new Set(fixed.flatMap((pg) => pg.items.flatMap((x) => [x.doi?.toLowerCase(), norm(x.title)].filter(Boolean) as string[])));
const fromPublished: ArchivePub[] = publications
  .filter((p) => p.status === 'published' && !(p.doi && known.has(p.doi.toLowerCase())) && !known.has(norm(p.title)))
  .map(fromPublication);

const pageKey = (y: number) => (y <= 2021 ? 'earlier' : y <= 2024 ? '2022-2024' : String(y));
for (const p of [...fromForm, ...fromPublished]) {
  const key = pageKey(p.year);
  let page = fixed.find((x) => x.key === key);
  if (!page) {
    page = { key, slug: `publications/${key}`, title: { bg: `Публикации ${key} г.`, en: `Publications ${key}` }, items: [] };
    fixed.push(page);
  }
  page.items = [...page.items, p];
}

// НАЦИД, Национален референтен списък: бележка, ISSN и категория за всички публикации в такива издания (виж nrs.ts)
const withNrs = (p: ArchivePub): ArchivePub => {
  const n = nrsFor(p.venue); if (!n) return p;
  const tag = `НАЦИД НРС, ID ${n.id}`;
  return { ...p, cat: p.cat === 'other' ? 'nat' : p.cat, issn: p.issn ?? n.issn,
    note: p.note?.includes('НАЦИД') ? p.note : p.note ? `${tag}; в отчета на БАН: ${p.note}` : tag };
};
for (const pg of fixed) pg.items = pg.items.map(withNrs);

// Ред под „Архив“: най-новата година първа, „до 2021 г.“ последна
const order = (k: string) => (k === 'earlier' ? 0 : Number(k.slice(0, 4)) + (k.length > 4 ? 0 : 0.5));
export const archivePages: ArchivePage[] = fixed.sort((a, b) => order(b.key) - order(a.key));

// Връзки под „Архив“ на страница „Публикации“
export const archives = archivePages.map((p) => ({ label: p.title, slug: p.slug }));
