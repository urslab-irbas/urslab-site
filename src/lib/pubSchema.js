// Обща проверка и форматиране на нова публикация.
// Ползва се на две места: във формата на сайта (/publications/new/) и в GitHub Action-а,
// който записва публикацията (scripts/add-publication.mjs). Правилата са едни и същи.
// Чист JavaScript (без TypeScript), за да работи и в браузъра, и в Node без компилация.

// Членове на колектива: ключ, фамилия (латиница и кирилица) и, ако фамилията се среща
// и при други хора, задължителен първи инициал.
export const TEAM = [
  { id: 'madzharov', names: ['Madzharov', 'Маджаров'] },
  { id: 'aleksandrov', names: ['Alexandrov', 'Aleksandrov', 'Александров'] },
  { id: 'chehlarova', names: ['Chehlarova', 'Чехларова'], initial: ['N', 'Н'] },
  { id: 'gaidarski', names: ['Gaidarski', 'Гайдарски'] },
  { id: 'hristozov', names: ['Hristozov', 'Христозов'] },
  { id: 'georgiev', names: ['Georgiev', 'Георгиев'], initial: ['R', 'Р'] },
];

// Категории, при които SJR или IF е задължителен
const NEEDS_METRIC = ['q1', 'q2', 'q3', 'q4', 'sjr'];
// Категории без издание (списание/сборник) — вместо това се иска издател
const BOOKS = ['mono', 'book'];

const PARTICLE = /^(?:(?:van|von|de|del|der|den|da|di|du|la|le|dos|das)\s+)*/;
const AUTHOR = /^\s*([^,&]+?)\s*,\s*((?:\p{Lu}\p{Ll}?\.\s?-?\s?)+)\s*(?:,\s*|$)/u;

/** Разделя низ с автори в APA стил: „Фамилия, И. И., Фамилия, И., & Фамилия, И.“ */
export function parseAuthors(raw) {
  const errors = [];
  let s = String(raw || '').trim();
  if (!s) return { list: [], errors: ['empty'] };
  const hadAmp = /&/.test(s);
  if ((s.match(/&/g) || []).length > 1) errors.push('amp-many');
  s = s.replace(/\s*,?\s*&\s*/g, ', ');
  const list = [];
  while (s.length) {
    const m = s.match(AUTHOR);
    if (!m) { errors.push('format:' + s.slice(0, 40)); break; }
    const surname = m[1].trim();
    const rest = surname.replace(PARTICLE, '');
    if (!/^\p{Lu}/u.test(rest)) { errors.push('format:' + surname); break; }
    list.push({ surname, initials: m[2].replace(/\s+/g, ' ').trim() });
    s = s.slice(m[0].length);
  }
  if (!errors.length && list.length >= 2 && !hadAmp) errors.push('amp-missing');
  return { list, errors };
}

/** Ключовете на членовете на колектива сред авторите */
export function teamFromAuthors(list) {
  const ids = [];
  for (const a of list) {
    for (const m of TEAM) {
      if (!m.names.some((n) => n.toLowerCase() === a.surname.toLowerCase())) continue;
      if (m.initial && !m.initial.includes(a.initials[0])) continue;
      if (!ids.includes(m.id)) ids.push(m.id);
    }
  }
  return ids;
}

export const cleanDoi = (d) => String(d || '').trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '');
const num = (v) => (v === '' || v === undefined || v === null ? undefined : Number(String(v).replace(',', '.')));
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-zа-я0-9]/gi, '');

/** Изданието в един ред: „Списание, 12(3), 45–67“ или „Издател“ за книги */
export function composeVenue(e) {
  if (BOOKS.includes(e.cat)) return [e.publisher, e.pages && `${e.pages} pp.`].filter(Boolean).join(', ');
  let v = e.venue || '';
  if (e.volume) v += `, ${e.volume}${e.issue ? `(${e.issue})` : ''}`;
  if (e.pages) v += `, ${String(e.pages).replace(/-/g, '–')}`;
  if (e.publisher) v += `, ${e.publisher}`;
  return v;
}

/** Пълен APA запис (за преглед и за текста на заявката) */
export function apa(e) {
  const title = String(e.title || '').replace(/\.\s*$/, '');
  const doi = cleanDoi(e.doi);
  const link = doi ? ` https://doi.org/${doi}` : e.url ? ` ${e.url}` : '';
  return `${String(e.authors || '').trim()} (${e.year}). ${title}. ${composeVenue(e)}.${link}`;
}

/**
 * Проверка. Връща масив от грешки { field, code } — празен масив = записът е правилен.
 * ctx: { catKeys, tagKeys, existing: [{ doi, title }], now: година }
 */
export function validate(e, ctx) {
  const err = [];
  const add = (field, code) => err.push({ field, code });
  const now = ctx.now || new Date().getFullYear();

  const a = parseAuthors(e.authors);
  if (a.errors.length) a.errors.forEach((c) => add('authors', c.split(':')[0]));
  else if (!teamFromAuthors(a.list).length) add('authors', 'no-team');

  const y = Number(e.year);
  if (String(e.year ?? '').trim() === '') add('year', 'required');
  else if (!Number.isInteger(y) || y < 1980 || y > now + 1) add('year', 'range');

  const t = String(e.title || '').trim();
  if (t.length < 10) add('title', 'short');
  if (/^[\p{Lu}\s\d\W]{25,}$/u.test(t)) add('title', 'caps');

  if (!ctx.catKeys.includes(e.cat)) add('cat', 'required');
  if (BOOKS.includes(e.cat)) { if (!String(e.publisher || '').trim()) add('publisher', 'required'); }
  else if (!String(e.venue || '').trim()) add('venue', 'required');

  if (e.pages && !/^[A-Za-z]?\d+(\s?[–-]\s?[A-Za-z]?\d+)?$/.test(String(e.pages).trim())) add('pages', 'fmt');
  if (e.volume && !/^[\w.\-–\s]{1,20}$/u.test(e.volume)) add('volume', 'fmt');

  const doi = cleanDoi(e.doi);
  if (doi && !/^10\.\d{4,9}\/\S+$/.test(doi)) add('doi', 'fmt');
  if (e.isbn && !/^(97[89][-\s]?)?(\d[-\s]?){9}[\dX]$/i.test(String(e.isbn).trim())) add('isbn', 'fmt');
  if (e.url && !/^https?:\/\/\S+$/.test(e.url)) add('url', 'fmt');

  const sjr = num(e.sjr), jif = num(e.jif), share = num(e.share);
  if (sjr !== undefined && !(sjr >= 0 && sjr < 100)) add('sjr', 'range');
  if (jif !== undefined && !(jif >= 0 && jif < 500)) add('jif', 'range');
  if (share !== undefined && !(share > 0 && share <= 100)) add('share', 'range');
  if (NEEDS_METRIC.includes(e.cat) && sjr === undefined && jif === undefined) add('sjr', 'needed');

  const tags = Array.isArray(e.tags) ? e.tags : [];
  if (!tags.length) add('tags', 'required');
  if (tags.some((g) => !ctx.tagKeys.includes(g))) add('tags', 'unknown');

  for (const x of ctx.existing || []) {
    if ((doi && x.doi && cleanDoi(x.doi).toLowerCase() === doi.toLowerCase()) || (norm(x.title) && norm(x.title) === norm(t))) {
      add(doi && x.doi && cleanDoi(x.doi).toLowerCase() === doi.toLowerCase() ? 'doi' : 'title', 'duplicate');
      break;
    }
  }
  return err;
}

/** Нормализиран запис за src/data/contrib.json */
export function normalize(e) {
  const out = {
    year: Number(e.year), cat: e.cat,
    authors: String(e.authors).trim().replace(/\s+/g, ' '),
    title: String(e.title).trim().replace(/\.\s*$/, ''),
  };
  for (const k of ['venue', 'volume', 'issue', 'pages', 'publisher', 'isbn', 'url', 'abstract']) {
    const v = String(e[k] ?? '').trim();
    if (v) out[k] = v;
  }
  const doi = cleanDoi(e.doi);
  if (doi) out.doi = doi;
  for (const k of ['sjr', 'jif', 'share']) { const v = num(e[k]); if (v !== undefined) out[k] = v; }
  out.tags = [...new Set(e.tags)];
  return out;
}

// Съобщения за грешките (BG / EN)
export const MESSAGES = {
  bg: {
    empty: 'Въведете авторите.',
    format: 'Неправилен запис. Всеки автор: „Фамилия, И.“ (инициали с точка), разделени със запетая.',
    'amp-missing': 'По APA преди последния автор се поставя „&“: „Иванов, И., & Петров, П.“',
    'amp-many': 'Знакът „&“ се поставя само веднъж — преди последния автор.',
    'no-team': 'Сред авторите няма член на колектива (проверете фамилията и инициала).',
    range: 'Стойността е извън допустимия диапазон.',
    short: 'Заглавието е твърде кратко.',
    caps: 'Не пишете заглавието само с главни букви.',
    required: 'Задължително поле.',
    needed: 'За Q1–Q4 и „SJR без квартил“ въведете SJR и/или IF.',
    unknown: 'Непозната тема.',
    duplicate: 'Тази публикация вече я има на сайта (същото DOI или заглавие).',
    fmt: 'Неправилен формат — вижте примера в полето.',
  },
  en: {
    empty: 'Enter the authors.',
    format: 'Wrong format. Each author: “Surname, I.” (initials with full stops), separated by commas.',
    'amp-missing': 'APA puts “&” before the last author: “Smith, J., & Jones, K.”',
    'amp-many': 'Use “&” only once — before the last author.',
    'no-team': 'No team member among the authors (check surname and initial).',
    range: 'Value out of range.',
    short: 'Title too short.',
    caps: 'Do not type the title in capitals only.',
    required: 'Required field.',
    needed: 'For Q1–Q4 and “SJR, no quartile”, enter SJR and/or IF.',
    unknown: 'Unknown topic.',
    duplicate: 'This publication is already on the site (same DOI or title).',
    fmt: 'Wrong format — see the example in the field.',
  },
};
