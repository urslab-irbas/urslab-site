// „Дял ИР“ — процент автори от Института по роботика (ИР-БАН) в авторския колектив, както в отчета на БАН
// („Процент автори от звеното“): брой автори от ИР ÷ общ брой автори × 100.
// Когато в записа има процент от отчета на БАН (share), той е водещ; иначе процентът се изчислява тук при build
// (shareCalc: true). Подадените / под печат (cat 'sub') нямат показатели.
//
// Автори от ИР: членовете на колектива (TEAM) — за всички свои публикации; съавторите с институция „ИР-БАН“ в регистъра
// COAUTHORS (src/lib/pubSchema.js) или в полето affil на записа (посочено при въвеждането през формата).
// ПРАВИЛО (07.10.2026): всеки съавтор извън колектива трябва да има известна институция — иначе build-ът спира
// със списък на неизвестните (институцията се взема първо от самата публикация). Публикация без автор от ИР има 0 %.
import type { ArchivePub } from './archive2022';
import { parseAuthors, isIRAuthor, unknownCoauthors } from '../lib/pubSchema.js';

type A = { surname: string; initials: string };

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
export const irShare = (authors: string, affil: Record<string, string> = {}): number | undefined => {
  const list = splitAuthors(authors);
  const n = list.filter((a) => isIRAuthor(a, affil)).length;
  if (!list.length) return undefined;
  return Math.round((n / list.length) * 10000) / 100;
};

/** Попълва share, ако липсва (без подадените / под печат) */
export const withShare = (p: ArchivePub): ArchivePub => {
  const unk = unknownCoauthors(splitAuthors(p.authors), p.affil);
  if (unk.length) throw new Error(`Съавтори без институция в „${p.title}“ (${p.year}): ${unk.join('; ')}. Добавете институцията им (както е в публикацията) в COAUTHORS (src/lib/pubSchema.js) или в полето affil на записа.`);
  if (p.share !== undefined || p.cat === 'sub') return p;
  const s = irShare(p.authors, p.affil);
  return s === undefined ? p : { ...p, share: s, shareCalc: true };
};
