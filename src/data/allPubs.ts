// Всички публикации от целия сайт:
//   текущ списък  = подадените / под печат (publications.ts със status ≠ 'published' + въведените през формата с категория „Подадени“)
//   архив         = годишните страници (archivePages.ts), вкл. излезлите от печат от publications.ts и contrib.json
// Ползва се за „Обобщен отчет“, броячите на направленията и филтрите на страница „Публикации“.
import type { ArchivePub } from './archive2022';
import { archivePages, formSubmitted, fromPublication } from './archivePages';
import { publications, type Publication } from './publications';
import { NSPDS_FUND, nspsdRefFor } from './nspsdRefs';

const currentMain = publications.filter((p) => p.status !== 'published');
export const currentPubs: ArchivePub[] = [...currentMain.map(fromPublication), ...formSubmitted];
export const archivedPubs: ArchivePub[] = archivePages.flatMap((p) => p.items).sort((a, b) => b.year - a.year);
export const allPubs: ArchivePub[] = [...currentPubs, ...archivedPubs];

/** ArchivePub → формата на списъка в „Публикации“ (PubList) */
export const toPublication = (a: ArchivePub): Publication => ({
  year: a.year, title: a.tr ? `${a.title} [${a.tr}]` : a.title, authors: [a.authors], venue: a.venue,
  status: a.cat === 'sub' ? (a.st ?? 'submitted') : 'published', doi: a.doi, doiOff: a.doiOff, url: a.url, tags: a.tags, abstract: a.abstract,
  funding: nspsdRefFor(a.title) ? NSPDS_FUND : undefined, fundVia: nspsdRefFor(a.title)?.via,
});
/** Текущият списък за „Публикации“ (с резюметата от publications.ts) */
export const currentList: Publication[] = [...currentMain, ...formSubmitted.map(toPublication)];
/** Архивът като списък (най-новите първо) */
export const archiveList: Publication[] = archivedPubs.map(toPublication);

/** За проверката за дубликати (формата и GitHub): заглавие, автори, DOI, година и страницата, на която е публикацията */
export type DupItem = { title: string; authors: string; doi?: string; year: number; where: string };
const pageOf = new Map(archivePages.flatMap((pg) => pg.items.map((it) => [it, pg.slug] as const)));
export const dupList: DupItem[] = [
  ...currentPubs.map((p) => ({ title: p.title, authors: p.authors, doi: p.doi, year: p.year, where: 'publications' })),
  ...archivedPubs.map((p) => ({ title: p.title, authors: p.authors, doi: p.doi, year: p.year, where: pageOf.get(p) ?? 'publications' })),
];
