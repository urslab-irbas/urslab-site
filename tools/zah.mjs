import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const r = await fetch('https://ir.bas.bg/ccs/2025/09.2/17.pdf', { headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/126' } });
const b = Buffer.from(await r.arrayBuffer()); const out = { status: r.status, size: b.length };
if (b.slice(0, 4).toString() === '%PDF') { fs.writeFileSync('/tmp/x.pdf', b); const t = execFileSync('pdftotext', ['-layout', '/tmp/x.pdf', '-']).toString(); out.head = t.slice(0, 3000); out.ack = [...t.matchAll(/(acknowledg|благодар|funded|financ|grant|D01-74|Security and Defen|Сигурност и отбрана|National Scientific Program)[\s\S]{0,600}/gi)].map((m) => m[0].replace(/\s+/g, ' ').slice(0, 600)); out.pages = execFileSync('pdfinfo', ['/tmp/x.pdf']).toString(); }
fs.writeFileSync('zah.json', JSON.stringify(out, null, 1));
