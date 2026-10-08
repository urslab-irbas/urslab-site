import { nrsByNumber, issnPortal } from '../scripts/verify-ids.mjs';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const out = {};
for (const n of ['2367-7635', '2367-7643']) { try { out['nrs:' + n] = await nrsByNumber(n); } catch (e) { out['nrs:' + n] = String(e); } try { out['issn:' + n] = await issnPortal(n); } catch (e) { out['issn:' + n] = String(e); } }
const r = await fetch('https://icaictsee.unwe.bg/ICAICTSEE-2026-Conference.Program.pdf', { headers: { 'User-Agent': 'Mozilla/5.0' } });
const b = Buffer.from(await r.arrayBuffer()); fs.writeFileSync('/tmp/p.pdf', b);
const t = execFileSync('pdftotext', ['-layout', '/tmp/p.pdf', '-']).toString();
out.prog_head = t.slice(0, 2500);
out.hits = [...t.matchAll(/.{0,200}(Madzharov|Маджаров|Chehlarova|Gaidarski|Scientometric|Bibliographic).{0,200}/gi)].map((m) => m[0].replace(/\s+/g, ' '));
const r2 = await fetch('https://icaictsee.unwe.bg/past-conferences/ICAICTSEE-2023.pdf', { headers: { 'User-Agent': 'Mozilla/5.0' } });
const b2 = Buffer.from(await r2.arrayBuffer()); fs.writeFileSync('/tmp/q.pdf', b2);
out.y2023 = execFileSync('pdftotext', ['-l', '3', '-layout', '/tmp/q.pdf', '-']).toString().replace(/\s+/g, ' ').slice(0, 2000);
fs.writeFileSync('zah.json', JSON.stringify(out, null, 1));
