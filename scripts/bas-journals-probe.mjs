// Проба 3: списанията на ИКИТ-БАН — Aerospace Research in Bulgaria и SES (Space, Ecology, Safety)
import { writeFileSync, mkdirSync } from 'node:fs';
const UA = 'URSlab-site probe (+https://urs.ir.bas.bg; mailto:a.madzharov@ir.bas.bg)';
mkdirSync('probe/bas', { recursive: true });
const out = [];
const getJ = async (u) => { try { const r = await fetch(u, { headers: { 'user-agent': UA } }); return r.ok ? r.json() : { err: r.status }; } catch (e) { return { err: String(e) }; } };
for (const q of ['Aerospace Research in Bulgaria', 'Space Ecology Safety', 'SES Space Ecology Safety proceedings']) {
  const j = await getJ(`https://api.crossref.org/journals?query=${encodeURIComponent(q)}&rows=10`);
  for (const x of j?.message?.items ?? []) out.push(`J ${q} → ${x.title} | ${x.publisher} | ISSN ${x.ISSN?.join(',')} | DOIs ${x.counts?.['total-dois']} | refs ${Math.round((x.coverage?.['references-current'] ?? 0) * 100)}%`);
  const w = await getJ(`https://api.crossref.org/works?query.container-title=${encodeURIComponent(q)}&rows=5&sort=published&order=desc&select=DOI,container-title,published,member,publisher,ISSN,resource,link,reference-count`);
  for (const x of w?.message?.items ?? []) out.push(`W ${q} → ${x.DOI} | ${x['container-title']?.[0]} | ${x.published?.['date-parts']?.[0]?.join('-')} | member ${x.member} ${x.publisher} | ISSN ${x.ISSN?.join(',')} | refs ${x['reference-count']} | ${x.resource?.primary?.URL} | link ${(x.link || []).map((l) => l.URL).join(' ')}`);
}
for (const u of ['http://journal.space.bas.bg/', 'http://www.space.bas.bg/SES/index.html']) {
  try {
    const r = await fetch(u, { headers: { 'user-agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
    const h = await r.text();
    const links = [...new Set([...h.matchAll(/href="([^"#]+)"/gi)].map((m) => { try { return new URL(m[1], r.url).href; } catch { return m[1]; } }))];
    out.push(`\nSITE ${u} → ${r.status} ${r.url}\n${h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1500)}\nLINKS:\n${links.slice(0, 120).join('\n')}`);
  } catch (e) { out.push(`SITE ${u} ERR ${e}`); }
}
writeFileSync('probe/bas/ikit.md', out.join('\n'));
