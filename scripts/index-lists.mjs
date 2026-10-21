// Б1 (задача #121): проверка на индексирането на цитиращото издание по ISSN и година.
//
// Списъците се държат в клона data, папка citation-scan/index/ (качват се от ръководителя през GitHub:
// Add file → Upload files). Името на файла определя базата:
//   scopus*.xlsx | scopus*.csv  — списък на източниците на Scopus (Elsevier, „Scopus Source List“): ISSN, EISSN,
//                                 покритие по години (Coverage), вид (Source Type) — Д-12 само ако годината
//                                 на цитиращия труд е в покритието;
//   wos*.csv | wos*.xlsx        — Web of Science (Master Journal List: SCIE, SSCI, AHCI, ESCI) — Д-12 (списъкът
//                                 няма години, затова се проверява по текущия списък и това се казва);
//   други имена (erih*, …)      — други бази данни (както в „Реферира се в“ на SONIX) — само за сведение,
//                                 точки не се присъждат по тях.
// Обикновено списъците са сгъстени в index.json.gz (scripts/index-build.mjs: Scopus — списания, поредици, сборници
// и книги по ISBN; WoS — SCIE, SSCI, AHCI, ESCI; Current Contents Connect); суровите файлове по-горе също се четат.
// Колоните се разпознават по заглавието им (ISSN, EISSN, Coverage, Title, Type), без значение от реда им.
// Ако няма списък на Scopus, ботът не предлага показател („не е проверено“) — работи както преди Б1.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import ExcelJS from 'exceljs';

export const INDEX_DIR = process.env.INDEX_DIR || 'citation-scan/index';
const DB_LABEL = { scopus: 'Scopus', wos: 'Web of Science', erih: 'ERIH Plus', ceeol: 'CEEOL', ebsco: 'EBSCO', doaj: 'DOAJ', elibrary: 'eLIBRARY.ru (РИНЦ)', zbmath: 'zbMATH', mathscinet: 'MathSciNet' };

/** ISSN → 8 знака без тире, главно X; невалиден → '' */
export const normIssn = (v) => { const s = String(v ?? '').toUpperCase().replace(/[^0-9X]/g, ''); return /^\d{7}[\dX]$/.test(s) ? s : ''; };
const fmtIssn = (s) => `${s.slice(0, 4)}-${s.slice(4)}`;

/** „1996-2024, 2026-ongoing“ → [[1996,2024],[2026,9999]] */
export function parseCoverage(v) {
  const out = [];
  for (const m of String(v ?? '').matchAll(/(\d{4})\s*(?:[-–—]\s*(\d{4}|ongoing|present|to date|current))?/gi)) {
    const a = Number(m[1]); const b = m[2] ? (/^\d{4}$/.test(m[2]) ? Number(m[2]) : 9999) : a;
    out.push([a, b]);
  }
  return out;
}

function parseCsv(text) {
  const first = text.split(/\r?\n/, 1)[0];
  const sep = (first.match(/;/g) ?? []).length > (first.match(/,/g) ?? []).length ? ';' : (first.includes('\t') ? '\t' : ',');
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; continue; }
    if (ch === '"') q = true;
    else if (ch === sep) { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

/** Таблица (масив от редове) → записи; заглавният ред е първият ред с колона „ISSN“ */
function records(rows, db) {
  const h = rows.findIndex((r) => r.some((c) => /issn/i.test(String(c ?? ''))));
  if (h < 0) return [];
  const head = rows[h].map((c) => String(c ?? '').trim().toLowerCase());
  const col = (re, not) => head.findIndex((c) => re.test(c) && !(not && not.test(c)));
  const iIssn = head.map((c, i) => (/issn/.test(c) ? i : -1)).filter((i) => i >= 0);
  const iCov = col(/coverage|покритие/);
  const iTitle = col(/title|заглавие|journal name|source/, /type|id/);
  const iType = col(/source type|^type$|вид/);
  const out = [];
  for (const r of rows.slice(h + 1)) {
    const issns = [...new Set(iIssn.flatMap((i) => String(r[i] ?? '').split(/[\s,;/]+/)).map(normIssn).filter(Boolean))];
    if (!issns.length) continue;
    out.push({ db, issns, title: iTitle >= 0 ? String(r[iTitle] ?? '').trim() : '', type: iType >= 0 ? String(r[iType] ?? '').trim() : '', ranges: iCov >= 0 ? parseCoverage(r[iCov]) : null });
  }
  return out;
}

const cellText = (v) => (v && typeof v === 'object' ? (v.text ?? v.result ?? v.richText?.map((t) => t.text).join('') ?? '') : v);

/** ISBN → 13 цифри (ISBN-10 се превръща); невалиден → '' */
export function isbn13(v) {
  const s = String(v ?? '').replace(/[^0-9Xx]/g, '').toUpperCase();
  if (/^97[89]\d{10}$/.test(s)) return s;
  if (/^\d{9}[\dX]$/.test(s)) { const b = '978' + s.slice(0, 9); let t = 0; for (let i = 0; i < 12; i++) t += Number(b[i]) * (i % 2 ? 3 : 1); return b + ((10 - (t % 10)) % 10); }
  return '';
}

/** Сгъстеният файл (index.json.gz) → същите структури */
function loadPacked(file, dbs, byIssn, byIsbn) {
  const j = JSON.parse(gunzipSync(readFileSync(file)).toString('utf8'));
  const name = file.split('/').pop();
  const note = (db, label, sub) => { const d = dbs.get(db) ?? { label, files: [name], n: 0, subs: new Set() }; d.n++; if (sub) d.subs.add(sub); dbs.set(db, d); };
  for (const [k, list] of Object.entries(j.issn ?? {})) for (const [code, cov, title] of list) {
    const [db, label, sub] = code === 's' ? ['scopus', 'Scopus'] : code.startsWith('w:') ? ['wos', 'Web of Science', code.slice(2)] : [code.slice(2).toLowerCase(), code.slice(2)];
    note(db, label, sub);
    const r = { db, issns: [k], title, type: sub ?? '', ranges: cov ? parseCoverage(cov) : null, sub };
    if (!byIssn.has(k)) byIssn.set(k, []); byIssn.get(k).push(r);
  }
  for (const [k, [code, year]] of Object.entries(j.isbn ?? {})) byIsbn.set(k, { db: code === 's' ? 'scopus' : code, year });
  if (byIsbn.size && dbs.has('scopus')) dbs.get('scopus').isbn = byIsbn.size;
  return j;
}

/** Зарежда всички списъци; връща { dbs: Map(db → {label, files, n}), byIssn: Map(issn → [запис]), byIsbn: Map(isbn13 → {db, year}), built } */
export async function loadIndexLists(dir = INDEX_DIR) {
  const dbs = new Map(), byIssn = new Map(), byIsbn = new Map();
  let built = '';
  if (!existsSync(dir)) return { dbs, byIssn, byIsbn, built };
  for (const f of readdirSync(dir).sort()) {
    if (f.endsWith('.json.gz')) { built = loadPacked(`${dir}/${f}`, dbs, byIssn, byIsbn).built ?? built; continue; }
    const m = f.toLowerCase().match(/^([a-z]+)[^/]*\.(xlsx|csv|tsv)$/);
    if (!m) continue;
    const db = m[1];
    let recs = [];
    if (m[2] === 'xlsx') {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(`${dir}/${f}`);
      for (const ws of wb.worksheets) {
        const rows = [];
        ws.eachRow({ includeEmpty: false }, (row) => rows.push((row.values ?? []).slice(1).map(cellText)));
        recs.push(...records(rows, db));
      }
    } else recs = records(parseCsv(readFileSync(`${dir}/${f}`, 'utf8')), db);
    const d = dbs.get(db) ?? { label: DB_LABEL[db] ?? f.replace(/\.[^.]+$/, ''), files: [], n: 0 };
    d.files.push(f); d.n += recs.length; dbs.set(db, d);
    for (const r of recs) for (const s of r.issns) { if (!byIssn.has(s)) byIssn.set(s, []); byIssn.get(s).push(r); }
  }
  return { dbs, byIssn, byIsbn, built };
}

const inYear = (ranges, y) => !ranges || !y ? null : ranges.some(([a, b]) => y >= a && y <= b);
const rangeText = (ranges) => (ranges ?? []).map(([a, b]) => (a === b ? `${a}` : `${a}–${b === 9999 ? 'днес' : b}`)).join(', ');

/**
 * Индексиране на изданието на цитиращия труд и предложение за показател.
 * in: { issns[], year, kind: 'journal' | 'book' | '' , doaj?: bool }
 * out: { checked, suggest?: '12s'|'12w'|'13'|'14', why, scopus?, wos?, other[] }
 */
export function classify(lists, { issns = [], isbns = [], year, kind = '', doaj = false }) {
  const ids = [...new Set(issns.map(normIssn).filter(Boolean))];
  const bks = [...new Set(isbns.map(isbn13).filter(Boolean))];
  const hits = ids.flatMap((s) => lists.byIssn.get(s) ?? []);
  const sc = hits.filter((r) => r.db === 'scopus');
  const ws = hits.filter((r) => r.db === 'wos');
  const other = [...new Set(hits.filter((r) => !['scopus', 'wos'].includes(r.db)).map((r) => lists.dbs.get(r.db)?.label ?? r.db))];
  if (doaj && !other.includes('DOAJ')) other.push('DOAJ');
  const res = { checked: lists.dbs.has('scopus'), other, issns: ids.map(fmtIssn) };
  const issnTxt = ids.length ? `ISSN ${ids.map(fmtIssn).join(' / ')}` : 'без ISSN';
  if (sc.length) {
    const ranges = sc.flatMap((r) => r.ranges ?? []);
    const ok = inYear(ranges.length ? ranges : null, year);
    res.scopus = { title: sc[0].title, ranges: rangeText(ranges), inYear: ok };
    if (ok !== false) { res.suggest = '12s'; res.why = `Scopus: ${sc[0].title || issnTxt}${ranges.length ? `, покритие ${rangeText(ranges)}` : ''} (${issnTxt})`; return res; }
  }
  // Б3: том на сборник или книга, индексирани в Scopus (по ISBN) — Д-12 („… или в монографии и колективни томове“)
  const bk = bks.map((b) => [b, lists.byIsbn?.get(b)]).find(([, r]) => r?.db === 'scopus');
  if (bk) { res.scopus = { isbn: bk[0], year: bk[1].year }; res.suggest = '12s'; res.why = `Scopus: книга / том на сборник, ISBN ${bk[0]}${bk[1].year ? ` (${bk[1].year})` : ''}`; return res; }
  if (ws.length) {
    const subs = [...new Set(ws.map((r) => r.sub).filter(Boolean))];
    res.wos = { title: ws[0].title, subs };
    res.suggest = '12w'; res.why = `Web of Science${subs.length ? ` (${subs.join(', ')})` : ''}: ${ws[0].title || issnTxt} (текущ списък, без години)`; return res;
  }
  if (!res.checked) { res.why = 'индексирането не е проверено (няма списък на Scopus)'; return res; }
  const notIn = res.scopus ? `в Scopus е за ${res.scopus.ranges}, но не и за ${year}` : 'не е в Scopus';
  const wosTxt = lists.dbs.has('wos') ? ' и WoS' : '';
  if (kind === 'journal' && ids.length) { res.suggest = '14'; res.why = `списание ${issnTxt}, ${notIn}${wosTxt}`; return res; }
  if (kind === 'book') { res.suggest = '13'; res.why = `сборник / книга (${[issnTxt, bks.length ? `ISBN ${bks.join(' / ')}` : ''].filter(Boolean).join(', ')}), ${notIn}${wosTxt}`; return res; }
  res.why = `${issnTxt}, ${notIn}${wosTxt} — изберете показателя`;
  return res;
}

/** Ред за отчета: какво е проверено */
export function listsSummary(lists) {
  if (!lists.dbs.size) return 'Списъци за индексиране: няма (показателят не се предлага; качете списъка на Scopus в клона data, папка citation-scan/index/).';
  const parts = [...lists.dbs.values()].map((d) => `${d.label}${d.subs?.size ? ` (${[...d.subs].join(', ')})` : ''} — ${d.n} ISSN${d.isbn ? ` и ${d.isbn} ISBN на книги и сборници` : ''}`);
  return `Списъци за индексиране${lists.built ? ` (към ${lists.built})` : ''}: ${parts.join('; ')}.${lists.dbs.has('wos') ? '' : ' Web of Science: няма списък — не е проверено.'}`;
}
