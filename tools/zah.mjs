import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const out = {};
const get = async (u) => { try { const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36', Accept: 'text/html,application/pdf,*/*' }, redirect: 'follow', signal: AbortSignal.timeout(60000) }); return { status: r.status, url: r.url, b: Buffer.from(await r.arrayBuffer()) }; } catch (e) { return { err: String(e) }; } };
const text = (b) => { if (b.slice(0, 4).toString() === '%PDF') { fs.writeFileSync('/tmp/x.pdf', b); return execFileSync('pdftotext', ['-layout', '/tmp/x.pdf', '-']).toString(); } return b.toString('utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' '); };
const ACK = /(acknowledg|благодар|funded|financ|grant|D01-74|Security and Defen|Сигурност и отбрана|National Scientific Program|Национална научна програма)[\s\S]{0,400}/gi;
const urls = {
  epstem: 'https://doi.org/10.55549/epstem.1461',
  lnns: 'https://doi.org/10.1007/978-3-032-26214-1_12',
  morski_view: 'https://journal.nvna.eu/index.php/msfj/article/view/194',
  morski_pdf: 'https://journal.nvna.eu/index.php/msfj/article/view/194/54',
  arci_pub: 'https://www.arci-conference.com/publications.html',
  arci_rg: 'https://doi.org/10.13140/RG.2.2.13085.63208',
};
for (const [k, u] of Object.entries(urls)) {
  const r = await get(u); if (r.err) { out[k] = r.err; continue; }
  let t = text(r.b);
  // EPSTEM: страницата на статията → PDF
  const pdf = r.b.toString('utf8').match(/href="([^"]+\.pdf[^"]*)"/i) || r.b.toString('utf8').match(/href="([^"]*\/download\/[^"]+)"/i) || r.b.toString('utf8').match(/citation_pdf_url" content="([^"]+)"/i);
  out[k] = { status: r.status, url: r.url, len: t.length, head: t.slice(0, 1500), ack: [...t.matchAll(ACK)].map((m) => m[0].slice(0, 400)).slice(0, 8), pdf: pdf?.[1] };
  if (pdf && k !== 'morski_pdf') {
    const p = await get(new URL(pdf[1], r.url).href);
    if (!p.err) { const pt = text(p.b); out[k + '_pdf'] = { status: p.status, len: pt.length, head: pt.slice(0, 2500), ack: [...pt.matchAll(ACK)].map((m) => m[0].slice(0, 500)).slice(0, 8) }; }
  }
}
fs.writeFileSync('zah.json', JSON.stringify(out, null, 1));
