// Проверка на идентификаторите на нова публикация в публичните регистри (стартира се от add-publication.mjs в GitHub Actions).
//   DOI          → doi.org (съществува ли) + Crossref / DataCite (заглавието да съвпада със заглавието във формата)
//   ISSN / eISSN → НАЦИД, Национален референтен списък (nrs.nacid.bg) → иначе ISSN Portal (portal.issn.org)
//   ISBN / eISBN → НАЦИД НРС → Crossref → Open Library
// Ако идентификаторът не е намерен или регистърът не отговаря — записът се отказва.
// Изданията от НАЦИД НРС получават автоматично своя НРС ID.
const UA = 'URSlab-site publication check (+https://urs.ir.bas.bg)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** GET с до 3 опита (при 429 / 5xx / мрежова грешка). Връща { status, text } или хвърля 'unavailable'. */
async function get(url, accept = 'application/json') {
  let last = '';
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA, accept }, signal: AbortSignal.timeout(30000) });
      if (r.status === 429 || r.status >= 500) { last = `HTTP ${r.status}`; await sleep(3000 * (i + 1)); continue; }
      return { status: r.status, text: await r.text() };
    } catch (e) { last = String(e.message || e); await sleep(3000 * (i + 1)); }
  }
  const err = new Error(`${new URL(url).host}: ${last}`); err.code = 'unavailable'; throw err;
}
const json = (t) => { try { return JSON.parse(t); } catch { return null; } };
const digits = (v) => String(v || '').toUpperCase().replace(/[^0-9X]/g, '');
const words = (s) => new Set(String(s || '').toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 2));
/** Дял на общите думи в двете заглавия (0…1) */
export function similarity(a, b) {
  const A = words(a), B = words(b); if (!A.size || !B.size) return 0;
  let n = 0; for (const w of A) if (B.has(w)) n++;
  return n / Math.min(A.size, B.size);
}

/** НАЦИД НРС: търсене по ISSN/ISBN → { id, title, numbers } или null */
export async function nrsByNumber(num) {
  const r = await get(`https://nrs.nacid.bg/api/Public/Nrs/GetInactiveAndActive?limit=10&intNumber=${encodeURIComponent(num)}`);
  const d = json(r.text); if (r.status !== 200 || !d) { const e = new Error('nrs.nacid.bg: неочакван отговор'); e.code = 'unavailable'; throw e; }
  const want = digits(num);
  for (const x of d.result ?? []) {
    const nums = (x.registerEntryNumbers ?? []).map((n) => n.number);
    if (nums.some((n) => digits(n) === want)) return { id: x.regNumber, title: [x.title, x.subTitle].filter(Boolean).join(': ').replace(/\s*\.\.\.\s*$/, '').trim(), numbers: nums, active: x.activeInNrs };
  }
  return null;
}

/** ISSN Portal: { found, title, status } — „Confirmed record“, „Provisional“ и др. */
export async function issnPortal(issn) {
  const r = await get(`https://portal.issn.org/resource/ISSN/${issn}`, 'text/html');
  if (r.status === 404) return { found: false };
  if (r.status !== 200) { const e = new Error(`portal.issn.org: HTTP ${r.status}`); e.code = 'unavailable'; throw e; }
  const text = r.text.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const rec = text.match(/ISSN Record\s+(\d{4}-\d{3}[\dX])/i);
  if (!rec || rec[1].toUpperCase() !== issn.toUpperCase()) return { found: false };
  const status = (text.match(/(Confirmed record|Provisional|Legacy|Register|Suppressed|Cancelled)/i) || [])[1] ?? '';
  const title = (text.match(/Key title:\s*(.*?)\s*(Copy permalink|Identifiers|No data available)/i) || [])[1] ?? '';
  if (/suppressed|cancelled/i.test(status)) return { found: false, status };
  return { found: true, status, title };
}

/** Crossref: книга / сборник по ISBN → заглавие или null */
export async function crossrefIsbn(isbn) {
  const r = await get(`https://api.crossref.org/works?filter=isbn:${digits(isbn)}&rows=1`);
  const d = json(r.text); if (r.status !== 200 || !d) { const e = new Error(`api.crossref.org: HTTP ${r.status}`); e.code = 'unavailable'; throw e; }
  const it = d.message?.items?.[0]; return it ? { title: (it.title || [])[0] ?? '', publisher: it.publisher ?? '' } : null;
}
/** Open Library: книга по ISBN → заглавие или null */
export async function openLibraryIsbn(isbn) {
  const r = await get(`https://openlibrary.org/search.json?isbn=${digits(isbn)}&fields=title,publisher&limit=1`);
  const d = json(r.text); if (r.status !== 200 || !d) { const e = new Error(`openlibrary.org: HTTP ${r.status}`); e.code = 'unavailable'; throw e; }
  const it = d.docs?.[0]; return it ? { title: it.title ?? '', publisher: (it.publisher || [])[0] ?? '' } : null;
}

/** DOI: съществува ли (doi.org) и какво е заглавието (Crossref или DataCite) */
export async function doiInfo(doi) {
  const h = await get(`https://doi.org/api/handles/${encodeURI(doi)}`);
  const hd = json(h.text);
  if (h.status === 404 || hd?.responseCode === 100) return { found: false };
  if (h.status !== 200 || hd?.responseCode !== 1) { const e = new Error(`doi.org: HTTP ${h.status}`); e.code = 'unavailable'; throw e; }
  const cr = await get(`https://api.crossref.org/works/${encodeURI(doi)}`);
  if (cr.status === 200) {
    const m = json(cr.text)?.message ?? {};
    return { found: true, source: 'Crossref', title: (m.title || [])[0] ?? '', issn: m.ISSN ?? [], isbn: m.ISBN ?? [], venue: (m['container-title'] || [])[0] ?? '' };
  }
  const dc = await get(`https://api.datacite.org/dois/${encodeURI(doi)}`);
  if (dc.status === 200) {
    const a = json(dc.text)?.data?.attributes ?? {};
    return { found: true, source: 'DataCite', title: (a.titles || [])[0]?.title ?? '', issn: [], isbn: [], venue: a.publisher?.name ?? a.publisher ?? '' };
  }
  return { found: true, source: 'doi.org', title: '' };
}

const ISSN_TYPES = ['issn', 'eissn'];
/**
 * Проверява записа (след normalize). Връща { errors: [{field, code, detail}], verified: [...текст за дневника], nrsId?, nrsTitle? }.
 * Грешки: notfound (идентификаторът не е в регистрите), doititle (DOI е на друга публикация), unavailable (регистърът не отговаря).
 */
export async function verifyEntry(e) {
  const out = { errors: [], verified: [] };
  const fail = (field, code, detail = '') => out.errors.push({ field, code, detail });
  const setNrs = (n) => { if (n && !out.nrsId) { out.nrsId = n.id; out.nrsTitle = n.title; } };
  try {
    // 1) DOI
    if (e.doi) {
      const d = await doiInfo(e.doi);
      if (!d.found) fail('doi', 'notfound', `https://doi.org/${e.doi}`);
      else if (d.title && similarity(d.title, e.title) < 0.6) fail('doi', 'doititle', d.title);
      else {
        out.verified.push(`DOI ${e.doi} — ${d.source}${d.title ? `: „${d.title}“` : ''}`);
        for (const n of [...d.issn, ...d.isbn]) { const x = await nrsByNumber(n); if (x) { setNrs(x); break; } }
      }
    }
    // 2) ISSN / ISBN
    const id = e.issn ?? e.isbn;
    if (id) {
      const label = { issn: 'ISSN', eissn: 'eISSN', isbn: 'ISBN', eisbn: 'eISBN' }[e.idType] ?? 'ID';
      const n = await nrsByNumber(id);
      if (n) { setNrs(n); out.verified.push(`${label} ${id} — НАЦИД НРС, ID ${n.id}: „${n.title}“`); }
      else if (ISSN_TYPES.includes(e.idType)) {
        const p = await issnPortal(id);
        if (p.found) out.verified.push(`${label} ${id} — ISSN Portal (${p.status || 'запис'})${p.title ? `: „${p.title}“` : ''}`);
        else fail('idValue', 'notfound', `${label} ${id}`);
      } else {
        const c = (await crossrefIsbn(id)) ?? (await openLibraryIsbn(id));
        if (c) out.verified.push(`${label} ${id} — ${c.publisher ? c.publisher + ', ' : ''}„${c.title}“`);
        else fail('idValue', 'notfound', `${label} ${id}`);
      }
    }
  } catch (err) {
    if (err.code === 'unavailable') fail(e.doi ? 'doi' : 'idValue', 'unavailable', err.message);
    else throw err;
  }
  return out;
}
