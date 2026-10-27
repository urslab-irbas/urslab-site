// Проба (без запис в Системата): какво дава Scilit (https://www.scilit.com) — документацията на API-то
// и няколко примерни заявки. Резултатът се записва в probe/scilit/ в клона на пробата. Нищо не се променя в main/data.
import { writeFileSync, mkdirSync } from 'node:fs';
const OUT = 'probe/scilit'; mkdirSync(OUT, { recursive: true });
const UA = 'URSlab-site probe (+https://urs.ir.bas.bg; mailto:a.madzharov@ir.bas.bg)';
const txt = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
const log = [];
async function get(url, name) {
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*' }, signal: AbortSignal.timeout(30000) });
    const body = await r.text();
    const isHtml = /html/i.test(r.headers.get('content-type') || '');
    writeFileSync(`${OUT}/${name}.txt`, `${url}\nHTTP ${r.status} ${r.headers.get('content-type')}\n\n${isHtml ? txt(body) : body}`.slice(0, 400000));
    if (isHtml) {
      const links = [...new Set([...body.matchAll(/href="([^"#]+)"/g)].map((m) => new URL(m[1], url).href))];
      writeFileSync(`${OUT}/${name}.links.txt`, links.join('\n'));
      return { status: r.status, links };
    }
    return { status: r.status, links: [] };
  } catch (e) { writeFileSync(`${OUT}/${name}.txt`, `${url}\nERROR ${e}`); return { status: 0, links: [] }; }
}
const seed = ['https://docs.scilit.com/', 'https://docs.scilit.com/guides/conventions/', 'https://docs.scilit.com/reference/organizations/', 'https://www.scilit.com/about/user-guide/api', 'https://www.scilit.com/about/user-guide/publishers'];
const seen = new Set(); const queue = [...seed]; let n = 0;
while (queue.length && n < 60) {
  const u = queue.shift(); if (seen.has(u)) continue; seen.add(u);
  const name = String(++n).padStart(2, '0') + '-' + u.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').slice(0, 80);
  const r = await get(u, name); log.push(`${r.status} ${u}`);
  for (const l of r.links) if (l.startsWith('https://docs.scilit.com/') && !seen.has(l) && !/\.(css|js|png|svg|ico|woff2?)(\?|$)/.test(l)) queue.push(l);
  await new Promise((s) => setTimeout(s, 400));
}
writeFileSync(`${OUT}/00-index.txt`, log.join('\n'));
console.log(log.join('\n'));
