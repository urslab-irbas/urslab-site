// Проба 2 (без запис в Системата): откъде се взема пълният текст (PDF) на статиите в списанията на БАН.
import { writeFileSync, mkdirSync } from 'node:fs';
const UA = 'URSlab-site probe (+https://urs.ir.bas.bg; mailto:a.madzharov@ir.bas.bg)';
const OUT = 'probe/bas'; mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((s) => setTimeout(s, ms));
const getJ = async (u) => { try { const r = await fetch(u, { headers: { 'user-agent': UA } }); return r.ok ? r.json() : null; } catch { return null; } };
const MEMBERS = { 4381: 'Drinov', 34444: 'IMI', 29796: 'Geol', 34400: 'ERI', 27567: 'IBL', 55864: 'Lit', 37767: 'IPS', 56004: 'SocProb', 52375: 'IBER', 49363: 'Balkan', 34316: 'Mech', 19814: 'ChemEng', 51960: 'Hist', 38004: 'CyrMeth' };
const rows = [];
for (const [id, nm] of Object.entries(MEMBERS)) {
  const j = await getJ(`https://api.crossref.org/members/${id}/works?rows=4&sort=published&order=desc&filter=type:journal-article`);
  const yr = await getJ(`https://api.crossref.org/members/${id}/works?rows=0&filter=from-pub-date:2025-10-01,until-pub-date:2026-09-30`);
  rows.push(`## ${nm} (${id}) — статии за последните 12 месеца: ${yr?.message?.['total-results']}`);
  for (const w of j?.message?.items ?? []) {
    const links = (w.link || []).map((l) => `${l['content-type']} ${l.URL}`);
    const page = w.resource?.primary?.URL;
    let pdfs = [], status = '';
    try {
      const r = await fetch(page, { headers: { 'user-agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
      status = `${r.status} ${r.headers.get('content-type')} → ${r.url}`;
      if (/html/.test(r.headers.get('content-type') || '')) {
        const h = await r.text();
        pdfs = [...new Set([...h.matchAll(/(?:href|content)="([^"]+?(?:\.pdf|\/download\/[^"]*|pdf[^"]*))"/gi)].map((m) => { try { return new URL(m[1], r.url).href; } catch { return m[1]; } }))].slice(0, 6);
        const meta = h.match(/<meta[^>]+name="citation_pdf_url"[^>]+content="([^"]+)"/i)?.[1];
        if (meta) pdfs.unshift('META ' + meta);
      }
    } catch (e) { status = 'ERR ' + e; }
    rows.push(`- ${w.DOI} | ${w['container-title']?.[0]} | ${w.published?.['date-parts']?.[0]?.join('-')} | refs ${w['reference-count']}\n  link: ${links.join(' ; ') || '—'}\n  page: ${page} → ${status}\n  pdf: ${pdfs.join(' ; ') || '—'}`);
    await sleep(500);
  }
}
writeFileSync(`${OUT}/pdf.md`, rows.join('\n'));
console.log(rows.join('\n'));
