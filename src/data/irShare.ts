// „Дял ИР“ — процент автори от Института по роботика (ИР-БАН) в авторския колектив, както в отчета на БАН
// („Процент автори от звеното“): брой автори от ИР ÷ общ брой автори × 100.
// Когато в записа има процент от отчета на БАН (share), той е водещ; иначе процентът се изчислява тук при build
// (shareCalc: true). Подадените / под печат (cat 'sub') нямат показатели. Ако сред авторите няма известен автор от ИР,
// дял не се изчислява.
//
// Автори от ИР (по отчетите на БАН и по институцията в публикациите; решения от 07.10.2026):
//   колективът на лабораторията — винаги, вкл. статиите на И. Гайдарски от 2022 г. и публикациите преди 2022 г.;
//   колеги от други звена на ИР — М. Димитрова, А. Кръстев, Т. Танев, С. Костова, И. Чавдаров, К. Йовчев,
//   Б. Найденов, Н. Вълчкова, Р. Захариев, В. Цветков, Г. Ангелов.
//   П. Кутинчев не се брои (ИИКТ-БАН). Неизвестни съавтори не се броят като автори от ИР.
import type { ArchivePub } from './archive2022';
import { parseAuthors } from '../lib/pubSchema.js';

type A = { surname: string; initials: string };
const IR: [RegExp, RegExp?][] = [
  [/^(Madzharov|Madjarov|Маджаров)$/i],
  [/^(Hristozov|Христозов)$/i],
  [/^(Gaidarski|Gaydarski|Гайдарски)$/i],
  [/^(Chehlarova|Чехларова)$/i, /^(N|Н)\./],
  [/^(Alexandrov|Aleksandrov|Александров)$/i, /^(A|А)\./],
  [/^(Georgiev|Георгиев)$/i, /^(R|Р)\./],
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
const isIR = (a: A) => IR.some(([s, i]) => s.test(a.surname.trim()) && (!i || i.test(a.initials.trim())));

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
  if (!list.length || !n) return undefined;
  return Math.round((n / list.length) * 10000) / 100;
};

/** Попълва share, ако липсва (без подадените / под печат) */
export const withShare = (p: ArchivePub): ArchivePub => {
  if (p.share !== undefined || p.cat === 'sub') return p;
  const s = irShare(p.authors);
  return s === undefined ? p : { ...p, share: s, shareCalc: true };
};
