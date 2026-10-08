import { nrsByNumber, issnPortal, crossrefIsbn, openLibraryIsbn, doiInfo } from '../scripts/verify-ids.mjs';
import fs from 'node:fs';
const out = {};
const j = async (u) => { try { const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 urslab (mailto:noreply@anthropic.com)' }, signal: AbortSignal.timeout(40000) }); return r.ok ? await r.json() : { status: r.status }; } catch (e) { return { err: String(e) }; } };
const t = async (u) => { try { const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/126' }, signal: AbortSignal.timeout(40000) }); const b = Buffer.from(await r.arrayBuffer()); return { status: r.status, ct: r.headers.get('content-type'), b }; } catch (e) { return { err: String(e) }; } };
for (const d of ['10.63662/5stkwe27', '10.13140/RG.2.2.13085.63208']) {
  try { out['doi:' + d] = await doiInfo(d); } catch (e) { out['doi:' + d] = String(e); }
  out['datacite:' + d] = await j('https://api.datacite.org/dois/' + d);
}
for (const n of ['1310-8255', '2603-4697', '1310-9278', '3033-1889', '2938-4796']) {
  try { out['nrs:' + n] = await nrsByNumber(n); } catch (e) { out['nrs:' + n] = String(e); }
  try { out['issn:' + n] = await issnPortal(n); } catch (e) { out['issn:' + n] = String(e); }
}
for (const i of ['978-84-09-69171-5']) {
  try { out['nrs:' + i] = await nrsByNumber(i); } catch (e) { out['nrs:' + i] = String(e); }
  try { out['cr:' + i] = await crossrefIsbn(i); } catch (e) { out['cr:' + i] = String(e); }
  try { out['ol:' + i] = await openLibraryIsbn(i); } catch (e) { out['ol:' + i] = String(e); }
}
const titles = ['Power Supply Technologies for Collaborative Service Robots: Characteristics and Comparative Overview', 'Intelligent Control and Sensor Fusion for a Tracked Mobile Collaborative Robot Operating in Unstructured Environments', 'Analysis of the Characteristics of the Power Types of Collaborative Service Robots', 'Off-Road Mobile Collaborative Robot for Healthcare', 'Мобилен колаборативен робот с висока проходимост за антитерористични операции'];
for (const q of titles) {
  const c = await j('https://api.crossref.org/works?rows=3&query.bibliographic=' + encodeURIComponent(q));
  out['cr:' + q] = (c.message?.items ?? []).map((w) => ({ t: w.title?.[0], doi: w.DOI, cont: w['container-title']?.[0], y: w.issued?.['date-parts']?.[0], a: (w.author ?? []).map((x) => x.family + ', ' + x.given + ' [' + (x.affiliation ?? []).map((z) => z.name).join('; ') + ']'), pages: w.page, vol: w.volume, issue: w.issue, isbn: w.ISBN, issn: w.ISSN, pub: w.publisher, abs: (w.abstract || '').slice(0, 1500) }));
  const o = await j('https://api.openalex.org/works?per-page=3&mailto=noreply@anthropic.com&search=' + encodeURIComponent(q.slice(0, 150)));
  out['oa:' + q] = (o.results ?? []).map((w) => ({ t: w.title, doi: w.doi, y: w.publication_year, src: w.primary_location?.source?.display_name, a: (w.authorships ?? []).map((x) => x.author.display_name + ' [' + (x.raw_affiliation_strings ?? []).join(' | ') + ']') }));
  await new Promise((r) => setTimeout(r, 800));
}
// Complex Control Systems, т. 9, бр. 2 (2025) и страница на ARCI 2025, ICBAST 2026, CVC 2026
for (const u of ['https://ir.bas.bg/ccs/2025/index.html', 'https://ir.bas.bg/ccs/2025/10/index.html', 'https://ir.bas.bg/ccs/2025/11/index.html', 'https://ir.bas.bg/ccs/2026/index.html', 'https://ir.bas.bg/ccs/index.html', 'https://ir.bas.bg/ccs/', 'https://www.arci-conference.com/', 'https://www.icbast.com/', 'https://cvc-conf.org/', 'https://www.cvc-conference.com/']) {
  const r = await t(u);
  out['page:' + u] = r.err ? r.err : { status: r.status, text: r.b.toString('utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 4000), links: [...r.b.toString('utf8').matchAll(/href\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]).filter((h) => /ccs|pdf|20(25|26)|proceed|program/i.test(h)).slice(0, 80) };
}
fs.writeFileSync('zah.json', JSON.stringify(out, null, 1));
