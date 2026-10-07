// „Дял ИР“ — процент автори от Института по роботика (ИР-БАН) в авторския колектив, както в отчета на БАН
// („Процент автори от звеното“): брой автори от ИР ÷ общ брой автори × 100.
// Когато в записа има процент от отчета на БАН (share), той е водещ; иначе процентът се изчислява тук при build
// (shareCalc: true). Подадените / под печат (cat 'sub') нямат показатели.
//
// Автори от ИР:
//   • ПРАВИЛО (07.10.2026): нов потребител влиза в системата като служител на ИР — всичките му публикации, вкл.
//     издадените при друг работодател, се броят за публикации на ИР. Важи за всички членове на колектива (TEAM в
//     src/lib/pubSchema.js — при нов член на колектива добавете го там и той се брои автоматично).
//   • колеги от други звена на ИР (по отчетите на БАН и институцията в публикациите): OTHER_IR по-долу.
//   • не са от ИР: П. Кутинчев (ИИКТ-БАН) и всички неизброени съавтори.
// Публикация без автор от ИР има дял 0 %.
import type { ArchivePub } from './archive2022';
import { parseAuthors, teamFromAuthors } from '../lib/pubSchema.js';

type A = { surname: string; initials: string };
const OTHER_IR: [RegExp, RegExp?][] = [
  [/^(Yovchev|Йовчев)$/i],
  [/^(Dimitrova|Димитрова)$/i, /^(M|М)\./],
  [/^(Krastev|Кръстев)$/i, /^(A|А)\./],
  [/^(Tanev|Танев)$/i, /^(T|Т)\./],
  [/^(Kostova|Костова)$/i, /^(S|С)\./],
  [/^(Chavdarov|Чавдаров)$/i],
  [/^(Naydenov|Найденов)$/i, /^(B|Б)\./],
  [/^(Valchkova|Вълчкова)$/i],
  [/^(Zahariev|Захариев)$/i],
  [/^(Tzvetkov|Tsvetkov|Цветков)$/i, /^(V|В)\./],
  [/^(Angelov|Ангелов)$/i, /^(G|Г)\./],
];
const isIR = (a: A) => teamFromAuthors([a]).length > 0 || OTHER_IR.some(([s, i]) => s.test(a.surname.trim()) && (!i || i.test(a.initials.trim())));

/** Автори като {фамилия, инициали}: „Фамилия, И., …“ (APA) или „И. Фамилия, …“ */
export const splitAuthors = (raw: string): A[] => {
  const p = parseAuthors(raw);
  if (p.list.length && !p.errors.some((e: string) => e.startsWith('format'))) return p.list;
  return raw.replace(/\s*&\s*/g, ', ').split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
    const m = x.match(/^((?:\p{Lu}\p{Ll}?\.\s?-?)+)\s*(.+)$/u);
    return m ? { surname: m[2], initials: m[1] } : { surname: x.split(/\s+/).pop() ?? x, initials: x.split(/\s+/).slice(0, -1).map((w) => w[0] + '.').join(' ') };
  });
};

/** Изчислен дял на ИР в % (2 знака) или undefined */
export const irShare = (authors: string): number | undefined => {
  const list = splitAuthors(authors);
  const n = list.filter(isIR).length;
  if (!list.length) return undefined;
  return Math.round((n / list.length) * 10000) / 100;
};

/** Попълва share, ако липсва (без подадените / под печат) */
export const withShare = (p: ArchivePub): ArchivePub => {
  if (p.share !== undefined || p.cat === 'sub') return p;
  const s = irShare(p.authors);
  return s === undefined ? p : { ...p, share: s, shareCalc: true };
};
