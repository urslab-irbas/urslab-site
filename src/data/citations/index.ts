// Проверените цитирания на колектива: всеки член има своя директория (src/data/citations/<id>/index.ts).
// Тук всеки цитиран труд се свързва с публикацията на сайта (по ISBN, DOI или откъс от заглавието);
// изграждането спира, ако някой запис не съвпада с публикация от сайта.
import type { ArchivePub } from '../archive2022';
import type { CitedWork } from './types';
import { citPts } from './rules';
import madzharov from './madzharov';
import aleksandrov from './aleksandrov';
import chehlarova from './chehlarova';
import gaidarski from './gaidarski';
import hristozov from './hristozov';
import georgiev from './georgiev';

const byMember: Record<string, CitedWork[]> = { madzharov, aleksandrov, chehlarova, gaidarski, hristozov, georgiev };

const norm = (s: string) => s.toLowerCase().replace(/[^0-9a-zа-я]/gi, '');
const matches = (w: CitedWork, p: ArchivePub) =>
  (w.pub.isbn && p.isbn && norm(w.pub.isbn) === norm(p.isbn)) ||
  (w.pub.doi && p.doi && w.pub.doi.toLowerCase() === p.doi.toLowerCase()) ||
  (w.pub.title && norm(p.title).includes(norm(w.pub.title)));

export interface CitBlock { work: CitedWork; pts: number }

/** Цитиранията на член на колектива, по публикация (ключ — заглавието на публикацията на сайта) */
export function citationsFor(member: string, pubs: ArchivePub[]): Map<ArchivePub, CitBlock> {
  const out = new Map<ArchivePub, CitBlock>();
  for (const w of byMember[member] ?? []) {
    const p = pubs.find((x) => x.cat !== 'sub' && x.team.includes(member) && matches(w, x));
    if (!p) throw new Error(`citations/${member}: няма публикация на сайта за цитирания труд № ${w.no} (${JSON.stringify(w.pub)})`);
    out.set(p, { work: w, pts: w.cites.reduce((s, c) => s + citPts(c.ind), 0) });
  }
  return out;
}
