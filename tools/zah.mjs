import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const out = {};
const UA = { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36' };
const get = async (u) => { const r = await fetch(u, { headers: UA, signal: AbortSignal.timeout(60000) }); return { status: r.status, url: r.url, b: Buffer.from(await r.arrayBuffer()) }; };
const r = await get('https://www.epstem.net/index.php/epstem/article/view/1461');
const html = r.b.toString('utf8');
out.links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')).filter((h) => /1461|download|pdf/i.test(h));
out.abstract = (html.match(/<section class="item abstract">([\s\S]*?)<\/section>/) || [])[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
out.meta = [...html.matchAll(/<meta name="(citation_[a-z_]+|DC\.[A-Za-z.]+)" content="([^"]*)"/g)].map((m) => m[1] + ': ' + m[2]).slice(0, 40);
for (const l of out.links.filter((h) => /article\/(view|download)\/1461\/\d+/.test(h))) {
  const v = await get(l.replace('/view/', '/download/'));
  if (v.b.slice(0, 4).toString() === '%PDF') { fs.writeFileSync('/tmp/x.pdf', v.b); const t = execFileSync('pdftotext', ['-layout', '/tmp/x.pdf', '-']).toString(); out.pdf = { url: l, head: t.slice(0, 2500), ack: [...t.matchAll(/(acknowledg|funded|financ|grant|D01-74|Security and Defen|National Scientific Program)[\s\S]{0,500}/gi)].map((m) => m[0].replace(/\s+/g, ' ').slice(0, 500)) }; break; }
}
fs.writeFileSync('zah.json', JSON.stringify(out, null, 1));
