// Всички публикации от целия сайт в един списък (за „Обобщен отчет“ на всеки член от колектива):
// годишните страници (archivePages.ts) + текущият списък (publications.ts) без повторения (по DOI или заглавие).
import type { ArchivePub } from './archive2022';
import { archivePages } from './archivePages';
import { publications } from './publications';

// Фамилия в publications.ts → ключ на член от колектива (src/data/team/*)
const surname: [RegExp, string][] = [
  [/Madzharov/i, 'madzharov'], [/Ale[kx]s?androv/i, 'aleksandrov'], [/\bN\.?\s*Chehlarova|Chehlarova,?\s*N\b/i, 'chehlarova'],
  [/Gaidarski/i, 'gaidarski'], [/Hristozov/i, 'hristozov'], [/\bR\.?\s*Georgiev|Georgiev,?\s*R\b/i, 'georgiev'],
];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zа-я0-9]/gi, '');

const fromArchive: ArchivePub[] = archivePages.flatMap((p) => p.items);
const seen = new Set(fromArchive.flatMap((p) => [p.doi?.toLowerCase(), norm(p.title)].filter(Boolean) as string[]));

const fromCurrent: ArchivePub[] = publications
  .filter((p) => !(p.doi && seen.has(p.doi.toLowerCase())) && !seen.has(norm(p.title)))
  .map((p) => ({
    year: p.year,
    cat: p.status !== 'published' ? 'sub' : p.tags.includes('software') ? 'soft' : 'other',
    authors: p.authors.join(', '),
    title: p.title,
    venue: p.venue,
    doi: p.doi,
    team: [...new Set(p.authors.flatMap((a) => surname.filter(([re]) => re.test(a)).map(([, k]) => k)))],
    tags: p.tags,
  }));

export const allPubs: ArchivePub[] = [...fromCurrent, ...fromArchive];
