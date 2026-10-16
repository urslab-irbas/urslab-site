// Проверените цитирания на колектива: всеки член има своя директория src/data/citations/<id>/ с два файла:
//   index.ts      — въведените на ръка (по Приложение „Цитирания“ към НАЦИД, SONIX …);
//   contrib.json  — въведените през формата „+ Цитиране“ (проверени от GitHub Action-а; в main е [],
//                   истинското копие е в клона data — виж .github/workflows/citation.yml).
// Всеки цитиран труд се свързва с публикацията на сайта (ръчните — по ISBN, DOI или откъс от заглавието;
// от формата — по ключа pubKey); изграждането спира, ако някой запис не съвпада с публикация от сайта.
import type { ArchivePub } from '../archive2022';
import type { CitedWork, Citation } from './types';
import type { CitInd } from './rules';
import { citPts } from './rules';
import { pubKey } from '../../lib/pubSchema.js';
import madzharov from './madzharov';
import aleksandrov from './aleksandrov';
import chehlarova from './chehlarova';
import gaidarski from './gaidarski';
import hristozov from './hristozov';
import georgiev from './georgiev';
import cMadzharov from './madzharov/contrib.json';
import cAleksandrov from './aleksandrov/contrib.json';
import cChehlarova from './chehlarova/contrib.json';
import cGaidarski from './gaidarski/contrib.json';
import cHristozov from './hristozov/contrib.json';
import cGeorgiev from './georgiev/contrib.json';

/** Запис, въведен през формата (src/lib/pubSchema.js → normalizeCitation + проверките на Action-а) */
export interface CitContrib {
  member: string; cited: string; ind: CitInd; year: number; authors: string; title: string; text: string;
  doi?: string; url?: string; where?: string; index?: 'scopus' | 'wos'; ghIssue?: number; verified?: string[]; evidence?: string; evidenceUrl?: string;
}

const manual: Record<string, CitedWork[]> = { madzharov, aleksandrov, chehlarova, gaidarski, hristozov, georgiev };
const fromForm: Record<string, CitContrib[]> = {
  madzharov: cMadzharov as CitContrib[], aleksandrov: cAleksandrov as CitContrib[], chehlarova: cChehlarova as CitContrib[],
  gaidarski: cGaidarski as CitContrib[], hristozov: cHristozov as CitContrib[], georgiev: cGeorgiev as CitContrib[],
};
export const citationMembers = Object.keys(manual);

const norm = (s: string) => s.toLowerCase().replace(/[^0-9a-zа-я]/gi, '');
const matches = (w: CitedWork, p: ArchivePub) =>
  (w.pub.isbn && p.isbn && norm(w.pub.isbn) === norm(p.isbn)) ||
  (w.pub.doi && p.doi && w.pub.doi.toLowerCase() === p.doi.toLowerCase()) ||
  (w.pub.title && norm(p.title).includes(norm(w.pub.title)));

export interface CitBlock { work: CitedWork; pts: number }

/** Цитиранията на член на колектива, по публикация (ръчно въведените + въведените през формата) */
export function citationsFor(member: string, pubs: ArchivePub[]): Map<ArchivePub, CitBlock> {
  const mine = pubs.filter((x) => x.cat !== 'sub' && x.team.includes(member));
  const works = new Map<ArchivePub, CitedWork>();
  for (const w of manual[member] ?? []) {
    if (w.hidden) continue; // трудове извън списъците на сайта — hiddenCitationsFor
    const p = mine.find((x) => matches(w, x));
    if (!p) throw new Error(`citations/${member}: няма публикация на сайта за цитирания труд № ${w.no} (${JSON.stringify(w.pub)})`);
    works.set(p, { ...w, cites: [...w.cites] });
  }
  let next = Math.max(0, ...(manual[member] ?? []).map((w) => w.no)); // и скритите трудове — без повторен номер
  for (const c of fromForm[member] ?? []) {
    const p = mine.find((x) => pubKey(x) === c.cited);
    if (!p) throw new Error(`citations/${member}/contrib.json: няма публикация на сайта с ключ ${c.cited} (заявка #${c.ghIssue})`);
    if (!works.has(p)) works.set(p, { no: ++next, pub: { title: p.title }, source: 'въведени през формата', cites: [] });
    const cite: Citation = { text: c.text, year: c.year, ind: c.ind, doi: c.doi, url: c.url, where: c.where, index: c.index, ghIssue: c.ghIssue, verified: c.verified, evidence: c.evidence, evidenceUrl: c.evidenceUrl };
    const dup = c.doi && works.get(p)!.cites.find((x) => x.doi && x.doi.toLowerCase() === c.doi!.toLowerCase());
    if (dup) throw new Error(`citations/${member}: цитирането с DOI ${c.doi} (заявка #${c.ghIssue}) е и в index.ts — махнете го от единия файл`);
    works.get(p)!.cites.push(cite);
  }
  const out = new Map<ArchivePub, CitBlock>();
  for (const [p, w] of works) out.set(p, { work: w, pts: w.cites.reduce((s, c) => s + citPts(c.ind), 0) });
  return out;
}

/** За формата и проверката в GitHub: публикуваните трудове на всеки член (ключ, заглавие, година) и вече въведените им цитирания */
export function citables(pubs: ArchivePub[]) {
  return Object.fromEntries(citationMembers.map((m) => {
    const cit = citationsFor(m, pubs);
    const list = pubs.filter((x) => x.cat !== 'sub' && x.team.includes(m)).map((p) => {
      const b = cit.get(p);
      return {
        key: pubKey(p), title: p.title, tr: p.tr, year: p.year, authors: p.authors, no: b?.work.no,
        cites: (b?.work.cites ?? []).map((c) => ({ title: c.text, doi: c.doi ?? '' })),
      };
    });
    return [m, list];
  }));
}

/** Цитиранията на трудове, които не са в списъците на сайта (CitedWork.hidden) — за общия бутон „Цитирания“ и „Точки НАЦИД“ */
export function hiddenCitationsFor(member: string): CitBlock[] {
  return (manual[member] ?? []).filter((w) => w.hidden).sort((a, b) => a.no - b.no)
    .map((w) => ({ work: { ...w, cites: [...w.cites] }, pts: w.cites.reduce((s, c) => s + citPts(c.ind), 0) }));
}
