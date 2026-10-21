// Б1 (задача #121): сгъстяване на списъците за индексиране в един малък файл за бота.
//
//   node scripts/index-build.mjs <папка с изтеглените списъци> [изходен файл]
//
// Входни файлове (имената, както ги дават Elsevier и Clarivate; разпознават се по съдържанието):
//   ext_list_*.xlsx            — Scopus Source List: листове „Scopus Sources…“ и „Serial Conf. Proc.…“ (ISSN, EISSN,
//                                покритие по години) и „All Conf. Proceedings…“ (ISBN на томовете, година);
//   Scopus_book_list*.xlsx     — книгите в Scopus (печатен и електронен ISBN, година);
//   *Citation_Index*.csv       — Web of Science Core Collection (Master Journal List): SCIE, SSCI, AHCI, ESCI;
//   Current_Contents*.csv      — Current Contents Connect (друга база — само за сведение).
// Изход (по подразбиране citation-scan/index/index.json.gz) — само идентификатори, години и кратко заглавие:
//   { built, sources: [...], issn: { "12345678": [[db, "1996-2024; 2026-днес" | "", заглавие]] },
//     isbn: { "978…": [db, година] } }   db: s = Scopus, w:<индекс> = Web of Science, o:<база> = друга база.
// Оригиналите не се качват в хранилището (големи са, а и са данни на Elsevier / Clarivate).
import { readdirSync, createReadStream, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import ExcelJS from 'exceljs';
import { normIssn, parseCoverage, isbn13, procKey } from './index-lists.mjs';

const dir = process.argv[2];
const OUT = process.argv[3] || 'citation-scan/index/index.json.gz';
if (!dir) { console.error('node scripts/index-build.mjs <папка> [изход]'); process.exit(1); }

const issn = {}; const isbn = {}; const proc = {}; const sources = [];
// заглавия на сборниците в Scopus (All Conf. Proceedings): ключ от думите на заглавието → години; за доклади без ISBN в Crossref
const addProc = (t, year) => { const k = procKey(t); const y = Number(year) || 0; if (!k || !y) return; (proc[k] ??= []); if (!proc[k].includes(y)) proc[k].push(y); };
const addIssn = (s, db, cov, title) => { const k = normIssn(s); if (!k) return; (issn[k] ??= []); if (!issn[k].some((e) => e[0] === db)) issn[k].push([db, cov, String(title ?? '').slice(0, 90)]); };
const addIsbn = (v, db, year) => { const k = isbn13(v); if (k && !isbn[k]) isbn[k] = [db, Number(year) || 0]; };
const clean = (f) => f.replace(/^(?:[0-9a-f]+-)?\d{10,}_/, '');
const covText = (v) => parseCoverage(v).map(([a, b]) => (a === b ? `${a}` : `${a}-${b === 9999 ? '9999' : b}`)).join('; ');
const txt = (v) => (v && typeof v === 'object' ? (v.text ?? v.result ?? v.richText?.map((t) => t.text).join('') ?? '') : (v ?? ''));

async function xlsx(file) {
  const rd = new ExcelJS.stream.xlsx.WorkbookReader(createReadStream(file), { sharedStrings: 'cache', worksheets: 'emit', hyperlinks: 'ignore', styles: 'ignore' });
  for await (const ws of rd) {
    let head = null, kind = null, n = 0;
    for await (const row of ws) {
      const v = (row.values ?? []).slice(1).map(txt);
      if (!head) {
        const h = v.map((c) => String(c).trim().toLowerCase());
        if (h.includes('issn') || h.some((c) => c.includes('isbn'))) {
          head = h;
          kind = h.some((c) => c.includes('isbn')) ? 'isbn' : 'issn';
        }
        continue;
      }
      const col = (re) => head.findIndex((c) => re.test(c));
      if (kind === 'issn') {
        const iT = col(/^source title/), iC = col(/^coverage/), iI = col(/^issn$/), iE = col(/^eissn$/);
        if (iC < 0) continue; // „Accepted Titles“ / „Discontinued“ — без покритие; покритието е в основния лист
        const cov = covText(v[iC]); if (!cov) continue;
        for (const i of [iI, iE]) if (i >= 0) addIssn(v[i], 's', cov, v[iT]);
        n++;
      } else {
        const iY = col(/year/);
        for (let i = 0; i < head.length; i++) if (head[i].includes('isbn')) addIsbn(v[i], 's', v[iY]);
        const iS = col(/^source title/), iP = col(/^proceedin/);
        if (iP >= 0) { addProc(v[iP], v[iY]); if (iS >= 0) addProc(v[iS], v[iY]); }
        n++;
      }
    }
    if (n) sources.push(`${clean(file.split('/').pop())} — ${n} реда (${kind === 'isbn' ? 'ISBN' : 'ISSN + покритие'})`);
  }
}

function csvRows(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; continue; }
    if (ch === '"') q = true; else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
const WOS = { science_citation_index_expanded: 'SCIE', social_sciences_citation_index: 'SSCI', arts__humanities_citation_index: 'AHCI', emerging_sources_citation_index: 'ESCI' };

for (const f of readdirSync(dir).sort()) {
  const p = `${dir}/${f}`; const low = f.toLowerCase();
  if (low.endsWith('.xlsx') && /ext_list|book_list|scopus/.test(low)) { await xlsx(p); continue; }
  if (!low.endsWith('.csv')) continue;
  const rows = csvRows(readFileSync(p, 'utf8'));
  const h = rows[0].map((c) => c.trim().toLowerCase());
  const iI = h.indexOf('issn'), iE = h.indexOf('eissn'), iT = h.indexOf('journal title');
  if (iI < 0) { sources.push(`${clean(f)} — пропуснат (няма колона ISSN)`); continue; }
  const w = Object.entries(WOS).find(([k]) => low.includes(k))?.[1];
  const cc = low.includes('current_contents') ? 'Current Contents Connect' : null;
  const db = w ? `w:${w}` : cc ? `o:${cc}` : `o:${clean(f).replace(/\.csv$/i, '').replace(/_/g, ' ')}`;
  for (const r of rows.slice(1)) for (const i of [iI, iE]) if (i >= 0) addIssn(r[i], db, '', r[iT]);
  sources.push(`${clean(f)} — ${rows.length - 1} издания (${w ? `Web of Science ${w}` : cc ?? 'друга база'})`);
}

const out = { built: new Date().toISOString().slice(0, 10), sources, issn, isbn, proc };
mkdirSync(OUT.split('/').slice(0, -1).join('/') || '.', { recursive: true });
const gz = gzipSync(Buffer.from(JSON.stringify(out)), { level: 9 });
writeFileSync(OUT, gz);
console.log(sources.join('\n'));
console.log(`ISSN: ${Object.keys(issn).length}, ISBN: ${Object.keys(isbn).length}, заглавия на сборници: ${Object.keys(proc).length} → ${OUT} (${(gz.length / 1e6).toFixed(1)} MB)`);
