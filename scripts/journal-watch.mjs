// Наблюдение на списанията на БАН (и други български издатели) за цитирания на трудовете на колектива.
//
// Защо: повечето списания на БАН имат DOI в Crossref, но НЕ изпращат там литературата си (references) —
// затова OpenAlex, OpenCitations и Semantic Scholar не знаят кого цитират (напр. PECR 85, 2026).
// Scilit (MDPI) не допуска автоматичен достъп (403), а „Cited-by Search“ в него не намира тези цитирания
// (проверено 27.10.2026 за DOI 10.17770/etr2024vol2.8064: 0 резултата при 2 цитирания в PECR 85) — затова четем направо:
//   1) Crossref: новите статии на всеки издател от journal-watch-sources.json (по номер на член в Crossref);
//   2) литературата от Crossref, ако издателят я изпраща; иначе — пълният текст (PDF или HTML) от сайта на списанието;
//   3) в текста — фамилиите на колектива; при съвпадение — evidence.mjs/findCited (DOI / ISBN на труда или
//      ≥ 70 % от думите на заглавието до фамилията) за всеки труд на колектива.
// Намереното се пази в citation-scan/journal-watch.json (клон data) и scan-citations.mjs го добавя към кандидатите;
// предварителната проверка и потвърждаването са както при другите източници (доказателство: линкът към пълния текст).
import { readFileSync, existsSync } from 'node:fs';
import { TEAM, latin, fromCrossref } from '../src/lib/pubSchema.js';
import { urlText, findCited } from './evidence.mjs';

const UA = 'URSlab-site journal watch (+https://urs.ir.bas.bg; mailto:a.madzharov@ir.bas.bg)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const SOURCES = JSON.parse(readFileSync(new URL('./journal-watch-sources.json', import.meta.url), 'utf8'));

// фамилиите на колектива (латиница, малки букви) — бърз филтър преди търсенето по трудове
const SURN = new Map(TEAM.map((m) => [m.id, [...new Set(m.names.map((n) => latin(n).replace(/[^a-z]/g, '')))]]));
const tokset = (t) => new Set(latin(t).split(/[^a-z]+/).filter((w) => w.length > 3));

async function crossrefPage(member, from, cursor) {
  const sel = 'DOI,title,container-title,author,published,issued,type,ISSN,issn-type,volume,issue,page,article-number,reference,link,resource,indexed,publisher';
  const u = `https://api.crossref.org/members/${member}/works?filter=from-index-date:${from},type:journal-article&rows=100&cursor=${encodeURIComponent(cursor)}&select=${sel}&mailto=a.madzharov@ir.bas.bg`;
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(u, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(60000) });
      if (r.ok) return (await r.json()).message;
      await sleep(4000 * (i + 1));
    } catch { await sleep(4000 * (i + 1)); }
  }
  return null;
}

/** Адресите, от които може да се вземе пълният текст: link от Crossref → страницата на статията → PDF от страницата */
async function fullText(w) {
  const tried = [];
  const urls = [...(w.link ?? []).filter((l) => /pdf|unspecified/.test(l['content-type'] ?? '')).map((l) => l.URL), w.resource?.primary?.URL].filter(Boolean);
  for (const u of [...new Set(urls)]) {
    tried.push(u);
    try {
      const r = await urlText(u);
      if (r.pdf && r.text.trim()) return { text: r.text, url: u, kind: 'PDF' };
      // HTML: търсим PDF на статията (citation_pdf_url или линк към .pdf / download); иначе — самият HTML текст
      const page = await fetch(u, { headers: { 'user-agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(30000) }).then((x) => x.text()).catch(() => '');
      const meta = page.match(/<meta[^>]+name="citation_pdf_url"[^>]+content="([^"]+)"/i)?.[1];
      const pdfs = [meta, ...[...page.matchAll(/href="([^"]+?\.pdf)"/gi)].map((m) => m[1])].filter(Boolean).map((p) => { try { return new URL(p, u).href; } catch { return null; } }).filter(Boolean);
      for (const p of [...new Set(pdfs)].slice(0, 2)) {
        try { const q = await urlText(p); if (q.pdf && q.text.trim()) return { text: q.text, url: p, kind: 'PDF' }; } catch { /* следващият */ }
      }
      if (r.text.length > 3000) return { text: r.text, url: u, kind: 'HTML' };
    } catch { /* следващият адрес */ }
  }
  return { text: '', url: tried[0] ?? '', kind: '' };
}

/**
 * Обхожда издателите от SOURCES и връща намерените цитирания.
 *   works — трудовете в Системата (scan-citations.mjs: Map key → { key, title, tr, owners, … })
 *   st    — състояние (citation-scan/journal-watch.json): { cursors: { member: дата }, hits: { doi|key: … }, checked: { doi: дата } }
 *   opts  — { timeLimitMs, since, log }
 */
export async function watchJournals(works, st, { timeLimitMs = 6 * 60_000, since = '2023-01-01', log = () => {} } = {}) {
  const t0 = Date.now();
  st.cursors ??= {}; st.hits ??= {}; st.checked ??= {};
  const stats = { members: 0, works: 0, refs: 0, pdf: 0, html: 0, noText: 0, withNames: 0, hits: 0, unfinished: [] };
  const byOwner = new Map(); // член → трудовете му
  for (const w of works.values()) for (const o of w.owners) { if (!byOwner.has(o)) byOwner.set(o, []); byOwner.get(o).push(w); }
  const today = new Date().toISOString().slice(0, 10);
  for (const src of SOURCES.members) {
    if (Date.now() - t0 > timeLimitMs) { stats.unfinished.push(src.name); continue; }
    stats.members++;
    const from = st.cursors[src.id] ?? since;
    let cursor = '*', done = true, maxIndexed = from;
    while (cursor) {
      if (Date.now() - t0 > timeLimitMs) { done = false; break; }
      const page = await crossrefPage(src.id, from, cursor);
      if (!page) { done = false; break; }
      for (const w of page.items ?? []) {
        if (Date.now() - t0 > timeLimitMs) { done = false; break; }
        const doi = String(w.DOI).toLowerCase();
        const idx = (w.indexed?.['date-time'] ?? '').slice(0, 10);
        if (st.checked[doi] && st.checked[doi] >= idx) { if (idx > maxIndexed) maxIndexed = idx; continue; }
        stats.works++;
        let text = '', url = '', kind = '';
        if ((w.reference ?? []).length) {
          // литературата е в Crossref → текст от позициите (без сваляне на PDF)
          text = w.reference.map((r) => [r.DOI && `doi ${r.DOI}`, r.unstructured, r.author, r['article-title'], r['volume-title'], r['journal-title'], r.year].filter(Boolean).join(' ')).join('\n');
          url = `https://doi.org/${doi}`; kind = 'литература в Crossref'; stats.refs++;
        } else {
          const ft = await fullText(w); text = ft.text; url = ft.url; kind = ft.kind;
          if (kind === 'PDF') stats.pdf++; else if (kind === 'HTML') stats.html++; else stats.noText++;
          await sleep(800);
        }
        st.checked[doi] = idx || today;
        if (idx > maxIndexed) maxIndexed = idx;
        if (!text) continue;
        const T = tokset(text);
        const members = [...SURN].filter(([, ns]) => ns.some((n) => T.has(n))).map(([id]) => id);
        if (!members.length) continue;
        stats.withNames++;
        const cr = fromCrossref(w);
        const alist = (w.author ?? []).map((a) => ({ surname: a.family ?? a.name ?? '', initials: (a.given ?? '').split(/[\s.-]+/).filter(Boolean).map((g) => g[0].toUpperCase() + '.').join(' ') }));
        for (const m of members) for (const cw of byOwner.get(m) ?? []) {
          const f = findCited(text, cw, m);
          if (!f) continue;
          const key = `${cw.key}|${doi}`;
          if (st.hits[key]) continue;
          st.hits[key] = {
            cited: cw.key, doi, found: today, source: `${src.name}: ${kind}`, how: f.how, url,
            cand: { doi, title: cr.title ?? (w.title ?? [])[0] ?? '', year: cr.year ?? w.issued?.['date-parts']?.[0]?.[0], authors: cr.authors ?? '', alist,
              venue: cr.venue ?? (w['container-title'] ?? [])[0] ?? '', issns: w.ISSN ?? [], type: 'article', url },
          };
          stats.hits++;
          log(`  ✔ ${doi} цитира ${cw.key} (${m}; ${f.how})`);
        }
      }
      cursor = (page.items ?? []).length < 100 ? null : page['next-cursor'];
    }
    if (done) st.cursors[src.id] = maxIndexed; else stats.unfinished.push(src.name);
  }
  // проверените DOI се пазят една година (за да не расте файлът безкрайно)
  const cut = new Date(Date.now() - 400 * 864e5).toISOString().slice(0, 10);
  for (const [d, v] of Object.entries(st.checked)) if (v < cut) delete st.checked[d];
  stats.seconds = Math.round((Date.now() - t0) / 1000);
  return stats;
}

export const loadWatch = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {});
