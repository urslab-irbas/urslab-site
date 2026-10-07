// Обща проверка и форматиране на нова публикация.
// Ползва се на две места: във формата на сайта (/publications/new/) и в GitHub Action-а,
// който записва публикацията (scripts/add-publication.mjs). Правилата са едни и същи.
// Чист JavaScript (без TypeScript), за да работи и в браузъра, и в Node без компилация.

// Членове на колектива: ключ, фамилия (латиница и кирилица) и, ако фамилията се среща
// и при други хора, задължителен първи инициал.
export const TEAM = [
  { id: 'madzharov', names: ['Madzharov', 'Madjarov', 'Маджаров'] },
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

// Идентификатор на изданието, когато няма DOI: ISSN / eISSN (8 знака, контролна цифра mod 11) или ISBN / eISBN (10 или 13 цифри)
export const ID_TYPES = ['issn', 'eissn', 'isbn', 'eisbn'];
export const ID_LABEL = { issn: 'ISSN (print)', eissn: 'eISSN (online)', isbn: 'ISBN (print)', eisbn: 'eISBN (online)' };
export const STATUSES = ['published', 'in-press', 'submitted'];
export function checkIssn(v) {
  const d = String(v || '').toUpperCase().replace(/[^0-9X]/g, '');
  if (!/^\d{7}[\dX]$/.test(d)) return false;
  const sum = [...d.slice(0, 7)].reduce((a, c, i) => a + Number(c) * (8 - i), 0);
  const chk = (11 - (sum % 11)) % 11;
  return (chk === 10 ? 'X' : String(chk)) === d[7];
}
export function checkIsbn(v) {
  const d = String(v || '').toUpperCase().replace(/[^0-9X]/g, '');
  if (/^\d{9}[\dX]$/.test(d)) return [...d].reduce((a, c, i) => a + (c === 'X' ? 10 : Number(c)) * (10 - i), 0) % 11 === 0;
  if (/^97[89]\d{10}$/.test(d)) return [...d].reduce((a, c, i) => a + Number(c) * (i % 2 ? 3 : 1), 0) % 10 === 0;
  return false;
}
export const checkId = (type, v) => (type === 'issn' || type === 'eissn' ? checkIssn(v) : type === 'isbn' || type === 'eisbn' ? checkIsbn(v) : false);
export const isPublished = (e) => (e.status ?? 'published') === 'published';

/** Номерът от формата (idValue) или от вече нормализиран запис (issn / isbn — така идва в GitHub) */
export const idOf = (e) => String(e.idValue ?? e.issn ?? e.isbn ?? '').trim();
/** Единен запис: ISSN → 1234-567X; ISBN → само цифри и тирета (всякакви тирета и интервали → „-“) */
export function canonId(type, v) {
  const s = String(v || '').trim();
  if (type === 'issn' || type === 'eissn') { const d = s.toUpperCase().replace(/[^0-9X]/g, ''); return d.length === 8 ? `${d.slice(0, 4)}-${d.slice(4)}` : s; }
  return s.replace(/[\s\u2010-\u2015\u2212]+/g, '-').replace(/-+/g, '-');
}

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

// ---- Проверка за вече въведена публикация: същото DOI, или същото заглавие и същите автори
const TRL = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sht', ъ: 'a', ь: 'y', ю: 'yu', я: 'ya' };
const latin = (s) => String(s || '').toLowerCase().replace(/[а-я]/g, (c) => TRL[c] ?? c).normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
const tnorm = (s) => latin(s).replace(/[^a-z0-9]/g, '');
const twords = (s) => new Set(latin(s).split(/[^a-z0-9]+/).filter((w) => w.length > 2));
const STOP = new Set(['and', 'van', 'der', 'den', 'del', 'von', 'des', 'les']);
/** Фамилиите на авторите (латиница, малки букви) — и от „Madzharov, A., …“, и от „A. Madzharov, …“ */
export function surnamesOf(authors) {
  const s = Array.isArray(authors) ? authors.join(', ') : String(authors || '');
  return [...new Set(latin(s).split(/[^a-z-]+/).map((w) => w.replace(/^-+|-+$/g, '')).filter((w) => w.length >= 3 && !STOP.has(w)))];
}
/**
 * Търси вече въведена публикация. existing: [{ title, authors?, doi?, year?, where? }].
 * Връща { by: 'doi' | 'title+authors' | 'title', item } или null. „title+authors“ — същото заглавие и поне един общ автор.
 * „title“ — само когато за намерената няма данни за авторите (тогава съвпадението на заглавието стига).
 */
export function findDuplicate(e, existing) {
  const doi = cleanDoi(e.doi).toLowerCase();
  const list = existing || [];
  if (doi) for (const x of list) if (x.doi && cleanDoi(x.doi).toLowerCase() === doi) return { by: 'doi', item: x };
  const t = tnorm(e.title), W = twords(e.title), A = surnamesOf(e.authors);
  if (!t) return null;
  for (const x of list) {
    if (!x.title) continue;
    const X = twords(x.title);
    let common = 0; for (const w of W) if (X.has(w)) common++;
    const same = tnorm(x.title) === t || (W.size >= 4 && common / Math.max(W.size, X.size) >= 0.9);
    if (!same) continue;
    const B = surnamesOf(x.authors);
    if (!B.length || !A.length) return { by: 'title', item: x };
    // поне един общ автор (грешка в името на съавтор не бива да пропусне дубликата)
    if (A.some((w) => B.includes(w))) return { by: 'title+authors', item: x };
  }
  return null;
}

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

  if (!STATUSES.includes(e.status)) add('status', 'required');
  if (!ctx.catKeys.includes(e.cat)) add('cat', 'required');
  else if (STATUSES.includes(e.status) && e.status !== 'published' && e.cat !== 'sub') add('cat', 'notsub');
  else if (e.status === 'published' && e.cat === 'sub') add('cat', 'pubsub');
  if (BOOKS.includes(e.cat)) { if (!String(e.publisher || '').trim()) add('publisher', 'required'); }
  else if (!String(e.venue || '').trim()) add('venue', 'required');

  if (e.pages && !/^[A-Za-z]?\d+(\s?[–-]\s?[A-Za-z]?\d+)?$/.test(String(e.pages).trim())) add('pages', 'fmt');
  if (e.volume && !/^[\w.\-–\s]{1,20}$/u.test(e.volume)) add('volume', 'fmt');

  const doi = cleanDoi(e.doi);
  if (doi && !/^10\.\d{4,9}\/\S+$/.test(doi)) add('doi', 'fmt');
  // Без DOI записът се приема само с проверен идентификатор на изданието (ISSN / eISSN / ISBN / eISBN)
  const idv = idOf(e);
  if (idv || e.idType) {
    if (!ID_TYPES.includes(e.idType)) add('idType', 'required');
    else if (!checkId(e.idType, idv)) add('idValue', e.idType.includes('issn') ? 'issn' : 'isbn');
  } else if (!doi) add('idValue', 'idneeded');

  if (e.url && !/^https?:\/\/\S+$/.test(e.url)) add('url', 'fmt');

  const sjr = num(e.sjr), jif = num(e.jif), share = num(e.share);
  if (sjr !== undefined && !(sjr >= 0 && sjr < 100)) add('sjr', 'range');
  if (jif !== undefined && !(jif >= 0 && jif < 500)) add('jif', 'range');
  if (share !== undefined && !(share > 0 && share <= 100)) add('share', 'range');
  if (isPublished(e) && NEEDS_METRIC.includes(e.cat) && sjr === undefined && jif === undefined) add('sjr', 'needed');

  const tags = Array.isArray(e.tags) ? e.tags : [];
  if (!tags.length) add('tags', 'required');
  if (tags.some((g) => !ctx.tagKeys.includes(g))) add('tags', 'unknown');

  const dup = findDuplicate(e, ctx.existing);
  if (dup) add(dup.by === 'doi' ? 'doi' : 'title', 'duplicate');
  return err;
}

/** Нормализиран запис за src/data/contrib.json */
export function normalize(e) {
  const out = {
    year: Number(e.year), cat: e.cat,
    authors: String(e.authors).trim().replace(/\s+/g, ' '),
    title: String(e.title).trim().replace(/\.\s*$/, ''),
  };
  out.status = e.status;
  const idv = idOf(e);
  if (idv && ID_TYPES.includes(e.idType)) { out.idType = e.idType; out[e.idType.includes('issn') ? 'issn' : 'isbn'] = canonId(e.idType, idv); }
  for (const k of ['venue', 'volume', 'issue', 'pages', 'publisher', 'url', 'abstract']) {
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
    duplicate: 'Тази публикация вече я има на сайта (същото DOI или същото заглавие и автори).',
    fmt: 'Неправилен формат — вижте примера в полето.',
    idneeded: 'Без DOI изберете вида идентификатор (ISSN, eISSN, ISBN или eISBN) и въведете вярната стойност.',
    issn: 'Невалиден ISSN: 8 знака във вида 1234-567X; последният е контролна цифра (проверете в portal.issn.org).',
    isbn: 'Невалиден ISBN: 10 или 13 цифри с вярна контролна цифра.',
    notsub: 'Статията не е публикувана — категорията трябва да е „Подадени / под печат“. Квартил (Q) се посочва след публикуване.',
    pubsub: 'За публикувана статия изберете реалната категория (Q1–Q4, SJR, ERIH+ и т.н.), а не „Подадени / под печат“.',
    notfound: 'Не е намерен в публичните регистри (НАЦИД НРС, ISSN Portal, Crossref, Open Library, doi.org). Проверете номера. Книги и сборници, които ги няма там, се въвеждат от ръководителя.',
    doititle: 'Този DOI е на друга публикация. Заглавие по DOI:',
    idmismatch: 'Номерът е в регистъра, но на издание с друго име (или регистърът не дава име за сравнение). Проверете номера и полето „Списание / сборник“. В регистъра:',
    unavailable: 'Регистърът не отговаря и записът не може да се провери. Опитайте отново по-късно (връзката „Поправете“ пази данните).',
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
    duplicate: 'This publication is already on the site (same DOI, or same title and authors).',
    fmt: 'Wrong format — see the example in the field.',
    idneeded: 'Without a DOI, choose the identifier type (ISSN, eISSN, ISBN or eISBN) and enter the correct value.',
    issn: 'Invalid ISSN: 8 characters as 1234-567X; the last one is a check digit (check at portal.issn.org).',
    isbn: 'Invalid ISBN: 10 or 13 digits with a correct check digit.',
    notsub: 'The paper is not published — the category must be “Submitted / in press”. The quartile (Q) is given after publication.',
    pubsub: 'For a published paper choose the real category (Q1–Q4, SJR, ERIH+, etc.), not “Submitted / in press”.',
    notfound: 'Not found in the public registers (NACID NRS, ISSN Portal, Crossref, Open Library, doi.org). Check the number. Books and proceedings that are not there are entered by the head of the lab.',
    doititle: 'This DOI belongs to another publication. Title by DOI:',
    idmismatch: 'The number is in the register, but for a venue with a different name (or the register gives no name to compare). Check the number and the “Journal / proceedings” field. In the register:',
    unavailable: 'The register does not respond and the entry cannot be checked. Try again later (the “Fix” link keeps the data).',
  },
};
