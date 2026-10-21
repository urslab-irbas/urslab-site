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

// ---- Съавтори извън колектива: „Фамилия, И.“ → институция
// ПРАВИЛО (07.10.2026): при всяко въвеждане в системата съавторите се проверяват. Институцията се взема първо от самата
// публикация (както авторът я е посочил), едва след това от други източници (отчет на БАН, OpenAlex/Crossref).
// Ако съавторът го няма тук, формата иска институцията му (поле affil), а build-ът спира при ръчно въведен запис.
// „ИР-БАН“ в института → авторът се брои като автор от ИР („Процент автори ИР“, src/data/irShare.ts); вкл. докторантите на ИР.
// Проверено на 07.10.2026 по институциите в самите публикации (OpenAlex/Crossref) за всички 107 публикации в системата.
// Членовете на колектива (TEAM) са винаги от ИР — за всички свои публикации, вкл. при предишен работодател.
const IR = 'ИР-БАН';
const NOT_IR = 'извън ИР (по отчета на БАН)';
const IMI = 'ИМИ-БАН', IICT = 'ИИКТ-БАН', SU = 'Софийски университет „Св. Климент Охридски“';
export const COAUTHORS = {
  // ИР-БАН (други звена; К. Йовчев — бивш член на лабораторията, отчитан към нея 2022–2025)
  'Yovchev, K.': IR, 'Chavdarov, I.': IR, 'Naydenov, B.': IR, 'Dimitrova, M.': IR, 'Krastev, A.': IR, 'Tanev, T.': IR,
  'Kostova, S.': IR, 'Valchkova, N.': IR, 'Вълчкова, Н.': IR, 'Zahariev, R.': IR, 'Захариев, Р.': IR, 'Tzvetkov, V.': IR,
  'Tsvetkov, V.': IR, 'Angelov, G.': IR, 'Paunski, Y.': IR, 'Varbanov, I.': IR, 'Raykov, P.': IR, 'Райков, П.': IR,
  // други институции
  'Kutinchev, P.': IICT, 'Кутинчев, П.': IICT, 'Chikurtev, D.': IICT, 'Djambazova, E.': IICT, 'Terzieva, V.': IICT, 'Ilchev, S.': IICT,
  'Bogdanova, G.': IMI, 'Noev, N.': IMI, 'Sabev, N.': IMI, 'Gecheva, N.': IMI, 'Chehlarova, T.': IMI, 'Чехларова, Т.': IMI,
  'Todorov, T.': 'ВТУ „Св. св. Кирил и Методий“', 'Todorova-Ekmekci, M.': 'ИЕФЕМ-БАН', 'Tomov, Zh.': 'Университет „Проф. д-р Асен Златаров“, Бургас',
  'Chehlarova, K.': 'УниБИТ', 'Чехларова, К.': 'УниБИТ', 'Yoshinov, R.': 'Лаборатория по телематика – БАН', 'Kotseva, M.': 'Лаборатория по телематика – БАН',
  'Miteva, L.': SU, 'Hrosinkov, V.': SU, 'Stefanov, A.': SU, 'Nedanovski, D.': SU, 'Stanev, H.': 'УНСС',
  'Angelov, S.': 'ИР-БАН (задочен докторант)', 'Apter, N.': NOT_IR, 'del Estad Herrero, A.': NOT_IR, 'Gachev, G.': NOT_IR, 'Dishkova, G.': IMI,
  'Todorov, P.': 'ВВВУ „Г. Бенковски“', 'Тодоров, П.': 'ВВВУ „Г. Бенковски“',
  'Ivanov, V.': NOT_IR, 'Tsvetanov, S.': NOT_IR, 'Petkov, I.': NOT_IR,
  'González-deSantos, L.': NOT_IR, 'Bruzual, J.': NOT_IR, 'Socías, D.': NOT_IR, 'Lacarra Arcos, E.': NOT_IR, 'Santos, M.': NOT_IR,
  'González, R.': NOT_IR, 'Gil, E.': NOT_IR, 'Moreno López, G.': NOT_IR, 'Karas, J.': NOT_IR, 'Vyshnevskyy, M.': NOT_IR,
  'Gebhardt, J.': NOT_IR, 'Haro, P.': NOT_IR, 'Bellingham, S.': NOT_IR,
  'Getsov, P.': 'ИКИТ-БАН (бивш ИКИ-БАН)', 'Гецов, П.': 'ИКИТ-БАН (бивш ИКИ-БАН)', 'Panova, P.': 'извън ИР (потвърдено от ръководителя)',
  // трудове 1996–2008 (НАЦИД; институции потвърдени от ръководителя, 21.10.2026)
  'Savov, V.': 'ВВВУ „Г. Бенковски“', 'Савов, В.': 'ВВВУ „Г. Бенковски“', 'Vanchev, D.': 'ВВВУ „Г. Бенковски“', 'Ванчев, Д.': 'ВВВУ „Г. Бенковски“', 'Todorov, M.': 'ВВВУ „Г. Бенковски“', 'Тодоров, М.': 'ВВВУ „Г. Бенковски“',
  'Marinov, M.': 'ВВВУ „Г. Бенковски“', 'Маринов, М.': 'ВВВУ „Г. Бенковски“', 'Benovski, Ts.': 'ВВВУ „Г. Бенковски“', 'Беновски, Ц.': 'ВВВУ „Г. Бенковски“',
  'Chalmanski, L.': 'ВТС към ГЩ', 'Чалмански, Л.': 'ВТС към ГЩ',
  'Biliderov, S.': 'ВВВУ „Г. Бенковски“ (докторант; тогава НВУ „В. Левски“, факултет „Авиационен“)', 'Билидеров, С.': 'ВВВУ „Г. Бенковски“ (докторант; тогава НВУ „В. Левски“, факултет „Авиационен“)',
  'Kambushev, M.': 'ВВВУ „Г. Бенковски“ (докторант; тогава НВУ „В. Левски“, факултет „Авиационен“)', 'Камбушев, М.': 'ВВВУ „Г. Бенковски“ (докторант; тогава НВУ „В. Левски“, факултет „Авиационен“)',
};
const IR_INST = /ИР[\s-]*БАН|IR[\s-]*BAS|Институт по роботика|Institute of Robotics/i;
/** Ключ на автор: „Фамилия, И.“ (първият инициал) */
export const authorKey = (a) => `${String(a.surname).trim()}, ${String(a.initials).trim().split(/\s+/)[0]}`;
/** Институцията на съавтор: посочената при въвеждането (affil) или от регистъра; undefined — неизвестна */
export const affiliationOf = (a, affil = {}) => (String(affil?.[authorKey(a)] ?? '').trim() || COAUTHORS[authorKey(a)]);
/** Съавторите извън колектива без известна институция */
export const unknownCoauthors = (list, affil = {}) => list.filter((a) => !teamFromAuthors([a]).length && !affiliationOf(a, affil)).map(authorKey);
/** Автор от ИР: член на колектива или съавтор с институция ИР-БАН */
export const isIRAuthor = (a, affil = {}) => teamFromAuthors([a]).length > 0 || IR_INST.test(affiliationOf(a, affil) ?? '');

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
export const latin = (s) => String(s || '').toLowerCase().replace(/[а-я]/g, (c) => TRL[c] ?? c).normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
export const tnorm = (s) => latin(s).replace(/[^a-z0-9]/g, '');
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
  else { const unk = unknownCoauthors(a.list, e.affil); if (unk.length) err.push({ field: 'affil', code: 'affil-needed', detail: unk.join('; ') }); }

  const y = Number(e.year);
  if (String(e.year ?? '').trim() === '') add('year', 'required');
  else if (!Number.isInteger(y) || y < 1980 || y > now + 1) add('year', 'range');

  const t = String(e.title || '').trim();
  if (t.length < 10) add('title', 'short');
  if (t.length >= 25 && /\p{Lu}/u.test(t) && !/\p{Ll}/u.test(t)) add('title', 'caps');

  if (!STATUSES.includes(e.status)) add('status', 'required');
  if (!ctx.catKeys.includes(e.cat)) add('cat', 'required');
  else if (STATUSES.includes(e.status) && e.status !== 'published' && e.cat !== 'sub') add('cat', 'notsub');
  else if (e.status === 'published' && e.cat === 'sub') add('cat', 'pubsub');
  if (BOOKS.includes(e.cat)) { if (!String(e.publisher || '').trim()) add('publisher', 'required'); }
  else if (!String(e.venue || '').trim()) add('venue', 'required');

  if (e.pages && !PAGES_RE.test(String(e.pages).trim())) add('pages', 'fmt');
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
  // институции на съавторите, посочени при въвеждането (само за авторите на записа, без членовете на колектива)
  const af = {};
  for (const a of parseAuthors(out.authors).list) { const k = authorKey(a), v = String(e.affil?.[k] ?? '').trim(); if (v && !teamFromAuthors([a]).length) af[k] = v; }
  if (Object.keys(af).length) out.affil = af;
  return out;
}

// ================= ЦИТИРАНИЯ (въвеждане през формата в режим „Ново цитиране“) =================
// Показатели от група „Д“ (ППЗРАСРБ, Таблица 2; Правилник на БАН, Област 5 „Технически науки“) и точките им.
export const CIT_INDS = ['12', '13', '14'];
export const CIT_POINTS = { 12: 10, 13: 3, 14: 2 };
export const CIT_INDEX = ['scopus', 'wos'];
// Как се доказва цитирането: doi — световна база (DOI; данните и литературата се вземат от Crossref);
// url — линк към цитиращия труд в друга интернет база; pdf — PDF файл, прикачен към заявката в GitHub.
// Системата търси цитирания труд в литературата / текста на цитиращия и приема само ако го намери.
export const CIT_SRC = ['doi', 'url', 'pdf'];
/** Постоянен ключ на публикация на сайта: DOI, иначе ISBN, иначе заглавието */
export function pubKey(p) {
  const doi = cleanDoi(p.doi).toLowerCase();
  if (doi) return `doi:${doi}`;
  const isbn = String(p.isbn ?? '').replace(/[^0-9Xx]/g, '').toUpperCase();
  if (isbn) return `isbn:${isbn}`;
  return `t:${tnorm(p.title).slice(0, 80)}`;
}
/** Цитиращият източник в един ред по образеца на НАЦИД */
export function citeText(e) {
  const t = String(e.title || '').trim().replace(/\.\s*$/, '');
  let v = String(e.venue || '').trim();
  if (e.volume) v += `${v ? ', ' : ''}${e.volume}${e.issue ? `(${e.issue})` : ''}`;
  if (e.pages) v += `${v ? ', ' : ''}${/^\d+\s?[–-]/.test(String(e.pages)) ? 'pp. ' : ''}${String(e.pages).replace(/-/g, '–')}`;
  const parts = [`${String(e.authors || '').trim()} ${t}.`, [v, e.publisher, e.year].filter(Boolean).join(', ')];
  const idv = idOf(e);
  if (idv && ID_TYPES.includes(e.idType)) parts.push(`${ID_LABEL[e.idType].split(' ')[0]} ${canonId(e.idType, idv)}`);
  return parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim();
}
/**
 * Проверка на ново цитиране: правилата за нова публикация (автори, година, заглавие, издание, DOI / ISSN / ISBN)
 * плюс правилата на НАЦИД за цитиранията. Връща [{ field, code, detail? }].
 * ctx: { cited: { title, year, authors } | null — цитираният труд (публикувана публикация на члена),
 *        existing: [{ title, authors, doi }] — вече въведените цитирания на същия труд, now }
 */
/** Отметка „да“ от формата / JSON: true, 'true', 'on', '1' */
export const isYes = (v) => v === true || ['true', 'on', '1', 'да'].includes(String(v ?? '').toLowerCase());

export function validateCitation(e, ctx) {
  const err = [];
  const add = (field, code, detail) => err.push(detail ? { field, code, detail } : { field, code });
  const now = ctx.now || new Date().getFullYear();
  if (!ctx.cited) add('cited', 'citednf');

  // Доказателство: DOI, линк или PDF
  const src = String(e.src || '');
  const doi = cleanDoi(e.doi);
  if (!CIT_SRC.includes(src)) add('src', 'evsrc');
  else if (src === 'doi' && !doi) add('doi', 'required');
  else if (src === 'url' && !String(e.url || '').trim()) add('url', 'required');
  if (doi && !/^10\.\d{4,9}\/\S+$/.test(doi)) add('doi', 'fmt');
  if (e.url && !/^https?:\/\/\S+$/.test(e.url)) add('url', 'fmt');
  // Показател и неговите условия
  if (!CIT_INDS.includes(String(e.ind))) add('ind', 'required');
  else if (String(e.ind) === '12' && !CIT_INDEX.includes(e.index)) add('index', 'cit12index');
  // Б2: Д-13 и Д-14 са само за издания с научно рецензиране — не се проверява автоматично, потвърждава го членът
  else if (['13', '14'].includes(String(e.ind)) && !isYes(e.peer)) add('peer', 'citpeer');
  // При DOI данните на цитиращия труд могат да дойдат от Crossref (бутонът „Попълни по DOI“ или проверката в GitHub)
  if (src === 'doi' && doi && !String(e.title || '').trim() && !ctx.full) return err;

  const a = parseAuthors(e.authors);
  if (a.errors.length) a.errors.forEach((c) => add('authors', c.split(':')[0]));
  // НАЦИД: самоцитиране — цитиращият труд е с участието на автора, който отчита цитирането
  else if (teamFromAuthors(a.list).includes(e.member)) add('authors', 'selfcite');

  const y = Number(e.year);
  if (String(e.year ?? '').trim() === '') add('year', 'required');
  else if (!Number.isInteger(y) || y < 1980 || y > now) add('year', 'citerange');
  else if (ctx.cited && y < Number(ctx.cited.year)) add('year', 'citeyear', String(ctx.cited.year));

  const t = String(e.title || '').trim();
  if (t.length < 10) add('title', 'short');
  if (t.length >= 25 && /\p{Lu}/u.test(t) && !/\p{Ll}/u.test(t)) add('title', 'caps');
  if (!String(e.venue || '').trim() && !String(e.publisher || '').trim()) add('venue', 'citevenue');

  if (e.pages && !PAGES_RE.test(String(e.pages).trim())) add('pages', 'fmt');
  if (e.volume && !/^[\w.\-–\s]{1,20}$/u.test(e.volume)) add('volume', 'fmt');
  // ISSN / ISBN — по желание (при линк или PDF може да няма), но ако е въведен — с вярна контролна цифра
  const idv = idOf(e);
  if (idv || e.idType) {
    if (!ID_TYPES.includes(e.idType)) add('idType', 'required');
    else if (!checkId(e.idType, idv)) add('idValue', e.idType.includes('issn') ? 'issn' : 'isbn');
  }
  if (String(e.ind) === '14' && !['issn', 'eissn'].includes(e.idType)) add('idType', 'cit14issn');

  // Всеки цитиращ източник се отчита веднъж за даден труд
  // (същото DOI, същото заглавие и общ автор, или заглавието се съдържа в текста на вече въведено цитиране)
  const list = ctx.existing || [];
  const dup = findDuplicate(e, list);
  const tt = tnorm(e.title);
  const inText = tt.length >= 15 ? list.find((x) => tnorm(x.title).includes(tt)) : null;
  if (dup) add(dup.by === 'doi' ? 'doi' : 'title', 'citedup', dup.item.title);
  else if (inText) add('title', 'citedup', inText.title);
  return err;
}
// ---- Данни от Crossref (бутонът „Попълни по DOI“ във формата и проверката в GitHub)
/** Страници: „12–25“, „e123“, „102345“ (номер на статия само ако е такъв); номера като „ENEURO.0390-24.2025“ не са страници */
export const PAGES_RE = /^[A-Za-z]?\d+(\s?[–-]\s?[A-Za-z]?\d+)?$/;
const crInitials = (given) => String(given || '').split(/[\s.]+/).filter(Boolean).map((g) => g.split('-').map((p) => p[0]?.toUpperCase() + '.').join('-')).join(' ');
/** Данните на цитиращия труд от Crossref във формата на формата (автори в APA и т.н.) */
export function fromCrossref(m) {
  const au = (m.author ?? []).filter((a) => a.family).map((a) => `${a.family}, ${crInitials(a.given)}`.replace(/,\s*$/, ''));
  const authors = au.length <= 1 ? (au[0] ?? '') : `${au.slice(0, -1).join(', ')}, & ${au[au.length - 1]}`;
  const y = (m.issued ?? m['published-print'] ?? m['published-online'] ?? m.published)?.['date-parts']?.[0]?.[0];
  const out = {
    authors, year: y, title: (m.title ?? [])[0]?.replace(/\s+/g, ' ').trim(),
    venue: (m['container-title'] ?? [])[0], volume: m.volume, issue: m.issue,
    pages: [m.page, m['article-number']].find((p) => PAGES_RE.test(String(p ?? '').trim())), publisher: m.publisher,
  };
  const issn = (m['issn-type'] ?? []).find((x) => x.type === 'print') ?? (m['issn-type'] ?? [])[0];
  const isbn = (m['isbn-type'] ?? [])[0]?.value ?? (m.ISBN ?? [])[0];
  if (issn) { out.idType = issn.type === 'electronic' ? 'eissn' : 'issn'; out.idValue = issn.value; }
  else if (isbn) { out.idType = 'isbn'; out.idValue = isbn; }
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined && v !== null && v !== ''));
}
/** Нормализирано цитиране за src/data/citations/<член>/contrib.json */
export function normalizeCitation(e) {
  const out = {
    member: e.member, cited: String(e.cited), ind: String(e.ind),
    year: Number(e.year),
    authors: String(e.authors ?? '').trim().replace(/\s+/g, ' '),
    title: String(e.title ?? '').trim().replace(/\.\s*$/, ''),
  };
  if (!out.year) delete out.year;
  if (out.ind === '12') out.index = e.index;
  if (['13', '14'].includes(out.ind) && isYes(e.peer)) out.peer = true; // потвърдено научно рецензиране (Б2)
  if (CIT_SRC.includes(e.src)) out.src = e.src;
  const idv = idOf(e);
  if (idv && ID_TYPES.includes(e.idType)) { out.idType = e.idType; out[e.idType.includes('issn') ? 'issn' : 'isbn'] = canonId(e.idType, idv); }
  for (const k of ['venue', 'volume', 'issue', 'pages', 'publisher', 'url', 'where']) { const v = String(e[k] ?? '').trim(); if (v) out[k] = v; }
  const doi = cleanDoi(e.doi);
  if (doi) out.doi = doi;
  if (e.evidence) out.evidence = String(e.evidence);
  if (e.evidenceUrl) out.evidenceUrl = String(e.evidenceUrl);
  out.text = citeText(out);
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
    'affil-needed': 'Посочете институцията на тези съавтори — така, както е в публикацията:',
    selfcite: 'Самоцитиране: сред авторите на цитиращия труд сте вие. По правилата на НАЦИД самоцитиранията не се отчитат.',
    citerange: 'Цитиращият труд трябва вече да е публикуван (година до текущата).',
    citeyear: 'Цитиращият труд не може да е по-стар от цитирания. Година на цитирания труд:',
    citevenue: 'Посочете списанието / сборника или издателя на цитиращия труд.',
    cit12index: 'За показател Д-12 посочете в коя база е индексиран цитиращият труд (Scopus или Web of Science).',
    cit14issn: 'Показател Д-14 е за списания: изберете ISSN или eISSN и въведете номера на списанието.',
    citpeer: 'Д-13 и Д-14 се признават само за издания с научно рецензиране: потвърдете с отметката под показателя, че сборникът / монографията / списанието е рецензирано.',
    citewhere: 'Посочете къде е цитирането — номер в списъка с литература и/или страница (напр. „[27], с. 136“).',
    citedup: 'Това цитиране вече е въведено за същия труд (всеки цитиращ източник се отчита веднъж). Въведено:',
    evsrc: 'Изберете как се доказва цитирането: DOI (световна база), линк (друга интернет база) или PDF файл.',
    evnotfound: 'Цитираният труд не е намерен в цитиращия (литература / текст). По правилата на НАЦИД се признава само проверимо цитиране.',
    evmismatch: 'Файлът / страницата не е на посочения цитиращ труд (заглавието не се намира в него).',
    evunreach: 'Линкът не се отваря или не дава текст за проверка.',
    evnopdf: 'В заявката няма прикачен PDF файл.',
    doimeta: 'DOI не е намерен в Crossref — попълнете данните на цитиращия труд ръчно.',
    citednf: 'Цитираният труд не е намерен сред вашите публикувани трудове на сайта. Отворете формата от бутона „+ Цитиране“ в „Обобщен отчет“.',
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
    'affil-needed': 'Give the institution of these co-authors — as stated in the publication:',
    selfcite: 'Self-citation: you are among the authors of the citing work. Under the NACID rules self-citations are not counted.',
    citerange: 'The citing work must already be published (year up to the current one).',
    citeyear: 'The citing work cannot be older than the cited one. Year of the cited work:',
    citevenue: 'Give the journal / proceedings or the publisher of the citing work.',
    cit12index: 'For indicator D-12 state where the citing work is indexed (Scopus or Web of Science).',
    cit14issn: 'Indicator D-14 is for journals: choose ISSN or eISSN and enter the journal number.',
    citpeer: 'D-13 and D-14 count only for peer-reviewed venues: confirm with the tick under the indicator that the proceedings / monograph / journal is peer-reviewed.',
    citewhere: 'State where the citation is — number in the reference list and/or page (e.g. “[27], p. 136”).',
    citedup: 'This citation is already entered for the same work (each citing source counts once). Entered:',
    evsrc: 'Choose how the citation is proven: DOI (world database), link (other online database) or PDF file.',
    evnotfound: 'The cited work was not found in the citing one (references / text). Under the NACID rules only a verifiable citation counts.',
    evmismatch: 'The file / page is not the stated citing work (its title is not found in it).',
    evunreach: 'The link does not open or gives no text to check.',
    evnopdf: 'No PDF file is attached to the request.',
    doimeta: 'DOI not found in Crossref — fill in the citing work by hand.',
    citednf: 'The cited work was not found among your published works on the site. Open the form from the “+ Citation” button in the “Summary report”.',
  },
};
