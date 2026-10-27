// Проба (без запис в Системата): издателите и списанията на БАН в Crossref — откъдето Scilit взема данните си.
// За всяко списание: ISSN, брой статии, дял с изпратена литература (references) и има ли връзка към пълен текст (link).
import { writeFileSync, mkdirSync } from 'node:fs';
const UA = 'URSlab-site probe (+https://urs.ir.bas.bg; mailto:a.madzharov@ir.bas.bg)';
const OUT = 'probe/bas'; mkdirSync(OUT, { recursive: true });
const get = async (u) => { for (let i = 0; i < 3; i++) { try { const r = await fetch(u, { headers: { 'user-agent': UA } }); if (r.ok) return r.json(); await new Promise((s) => setTimeout(s, 3000)); } catch { await new Promise((s) => setTimeout(s, 3000)); } } return null; };
const Q = ['Bulgarian Academy of Sciences', 'Marin Drinov', 'Institute of Mathematics and Informatics', 'Geological Institute', 'Economic Research Institute', 'Institute for Bulgarian Language', 'Institute of Literature', 'Institute for the Study of Societies and Knowledge', 'Institute of Philosophy and Sociology', 'Biodiversity and Ecosystem Research', 'Institute of Balkan Studies', 'Institute of Information and Communication Technologies', 'Institute of Robotics', 'Bulgarian Academy', 'Sofia University', 'Bulgaria'];
const members = new Map();
for (const q of Q) {
  const j = await get(`https://api.crossref.org/members?query=${encodeURIComponent(q)}&rows=100`);
  for (const m of j?.message?.items ?? []) if (/bulgar|sofia|bas\b|drinov|plovdiv|varna/i.test(`${m['primary-name']} ${m.location} ${(m.names || []).join(' ')}`)) members.set(m.id, m);
}
const rows = [];
for (const m of members.values()) {
  const cov = m.coverage || {};
  rows.push(`## ${m['primary-name']} — member ${m.id}; ${m.location}; prefixes ${m.prefixes.join(', ')}; works ${m.counts?.['total-dois']}; references(current) ${Math.round((cov['references-current'] ?? 0) * 100)}%; full-text links ${Math.round((cov['resource-links-current'] ?? 0) * 100)}%`);
  const jj = await get(`https://api.crossref.org/members/${m.id}/works?rows=0&facet=container-title:100,issn:100`);
  const f = jj?.message?.facets || {};
  for (const [t, n] of Object.entries(f['container-title']?.values || {})) rows.push(`- ${t}: ${n}`);
  rows.push(`  ISSN: ${Object.keys(f.issn?.values || {}).join(', ')}`);
  // пример: последната статия — има ли литература и линк към PDF
  const s = await get(`https://api.crossref.org/members/${m.id}/works?rows=3&sort=published&order=desc&select=DOI,title,container-title,reference-count,link,resource,published`);
  for (const w of s?.message?.items ?? []) rows.push(`  · ${w.DOI} | ${w['container-title']?.[0]} | refs ${w['reference-count']} | link ${(w.link || []).map((l) => l.URL).join(' ') || '—'} | page ${w.resource?.primary?.URL}`);
}
writeFileSync(`${OUT}/members.md`, rows.join('\n'));
console.log(rows.join('\n'));
