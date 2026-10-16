// Проверка на доказателството за цитиране (стартира се от add-citation.mjs в GitHub Actions).
//   doi — данните на цитиращия труд и списъкът му с литература от Crossref (api.crossref.org);
//   url — страницата или PDF файлът на линка;
//   pdf — PDF файлът, прикачен към заявката в GitHub.
// Правило (НАЦИД): цитирането се признава само ако цитираният труд се намира в цитиращия —
// по DOI / ISBN на цитирания труд или по заглавието му близо до фамилията на автора.
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { latin, TEAM, fromCrossref } from '../src/lib/pubSchema.js';
export { fromCrossref };

const UA = 'URSlab-site citation check (+https://urs.ir.bas.bg; mailto:a.madzharov@ir.bas.bg)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const unavailable = (msg) => { const e = new Error(msg); e.code = 'unavailable'; return e; };

async function fetchRetry(url, opts = {}) {
  let last = '';
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { redirect: 'follow', ...opts, headers: { 'user-agent': UA, ...(opts.headers ?? {}) }, signal: AbortSignal.timeout(45000) });
      if (r.status === 429 || r.status >= 500) { last = `HTTP ${r.status}`; await sleep(3000 * (i + 1)); continue; }
      return r;
    } catch (e) { last = String(e.message || e); await sleep(3000 * (i + 1)); }
  }
  throw unavailable(`${new URL(url).host}: ${last}`);
}

// ---------------- Crossref ----------------
/** Записът в Crossref по DOI → message или null (DOI не е в Crossref, напр. DataCite) */
export async function crossrefWork(doi) {
  const r = await fetchRetry(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, { headers: { accept: 'application/json' } });
  if (r.status === 404) return null;
  if (r.status !== 200) throw unavailable(`api.crossref.org: HTTP ${r.status}`);
  return (await r.json()).message ?? null;
}

// ---------------- Текст: линк и PDF ----------------
function pdfText(buf) {
  const dir = mkdtempSync(join(tmpdir(), 'cit-'));
  const f = join(dir, 'a.pdf');
  writeFileSync(f, buf);
  try { return execFileSync('pdftotext', ['-q', '-enc', 'UTF-8', f, '-'], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8'); }
  catch { return ''; }
}
const htmlText = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
/** Текстът зад линк (HTML или PDF) → { text, pdf } */
export async function urlText(url, headers = {}) {
  const r = await fetchRetry(url, { headers });
  if (r.status !== 200) throw Object.assign(new Error(`HTTP ${r.status}`), { code: 'unreach' });
  const type = r.headers.get('content-type') ?? '';
  const buf = Buffer.from(await r.arrayBuffer());
  const isPdf = /pdf/i.test(type) || buf.subarray(0, 5).toString() === '%PDF-';
  const text = isPdf ? pdfText(buf) : htmlText(buf.toString('utf8'));
  return { text, pdf: isPdf };
}
/** Линкът към прикачения PDF файл в текста на заявката (GitHub: user-attachments) */
export function attachmentUrl(body) {
  const links = [...String(body).matchAll(/https:\/\/github\.com\/(?:user-attachments\/files|[\w.-]+\/[\w.-]+\/files)\/[^\s)"'\]]+/g)].map((m) => m[0]);
  return links.find((u) => /\.pdf(\?|$)/i.test(u)) ?? links[0] ?? null;
}

// ---------------- Търсене на цитирания труд ----------------
const toks = (s) => latin(s).replace(/-\s*\n\s*/g, '').split(/[^a-z0-9]+/).filter(Boolean);
const STOP = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'over', 'using', 'based', 'на', 'и', 'за', 'по', 'от', 'при', 'със'].map((w) => latin(w)));
const sig = (s) => [...new Set(toks(s).filter((w) => w.length > 3 && !STOP.has(w)))];
const digits = (v) => String(v || '').toUpperCase().replace(/[^0-9X]/g, '');

/**
 * Намира ли се цитираният труд в текста?  cited: { title, tr?, key, authors }, member: ключ в TEAM.
 * Приема се при: DOI или ISBN на труда в текста, или ≥ 70 % от значимите думи на заглавието
 * в прозорец от 80 думи около фамилията на автора (на латиница или кирилица).
 */
export function findCited(text, cited, member) {
  const raw = String(text || '');
  if (!raw.trim()) return null;
  const key = String(cited.key || '');
  if (key.startsWith('doi:') && raw.toLowerCase().includes(key.slice(4))) return { how: `DOI ${key.slice(4)} на цитирания труд`, snippet: '' };
  if (key.startsWith('isbn:') && digits(raw).includes(key.slice(5))) return { how: `ISBN на цитирания труд`, snippet: '' };
  const T = toks(raw);
  const names = new Set((TEAM.find((m) => m.id === member)?.names ?? []).map((n) => latin(n).replace(/[^a-z]/g, '')));
  let best = 0, at = -1;
  // заглавието на езика на труда и преводът му (tr на сайта) — цитиращите често дават превода
  for (const W of [sig(cited.title), sig(cited.tr)].filter((x) => x.length)) {
    for (let i = 0; i < T.length; i++) {
      if (!names.has(T[i])) continue;
      const win = new Set(T.slice(Math.max(0, i - 40), i + 40));
      const r = W.filter((w) => win.has(w)).length / W.length;
      if (r > best) { best = r; at = i; }
    }
  }
  if (best >= 0.7) return { how: `заглавието на цитирания труд до фамилията на автора (${Math.round(best * 100)} % от думите)`, snippet: T.slice(Math.max(0, at - 15), at + 25).join(' ') };
  return null;
}
/** Има ли заглавието на цитиращия труд в текста (за да е сигурно, че файлът/страницата е на него) */
export function hasTitle(text, title) {
  const W = sig(title); if (!W.length) return true;
  const T = new Set(toks(String(text).slice(0, 20000)));
  return W.filter((w) => T.has(w)).length / W.length >= 0.7;
}
/** Литературата от Crossref → търсене на цитирания труд; връща { found, n, pos, how } */
export function findInRefs(refs, cited, member) {
  for (let i = 0; i < refs.length; i++) {
    const r = refs[i];
    const t = [r.DOI && `doi ${r.DOI}`, r.unstructured, r.author, r['article-title'], r['volume-title'], r['journal-title'], r.ISBN, r.year].filter(Boolean).join(' ');
    const f = findCited(`${t}`, cited, member) ?? (r.DOI && String(cited.key).startsWith('doi:') && r.DOI.toLowerCase() === String(cited.key).slice(4) ? { how: 'DOI' } : null);
    if (f) return { found: true, n: refs.length, pos: i + 1, how: f.how };
    // в литературата обикновено е само фамилията на първия автор + заглавието: по-мек праг за един запис
    const X = new Set(toks(t));
    const names = (TEAM.find((m) => m.id === member)?.names ?? []).map((n) => latin(n).replace(/[^a-z]/g, ''));
    for (const W of [sig(cited.title), sig(cited.tr)].filter((x) => x.length))
      if (names.some((n) => X.has(n)) && W.filter((w) => X.has(w)).length / W.length >= 0.6) return { found: true, n: refs.length, pos: i + 1, how: 'заглавие и фамилия в литературата' };
  }
  return { found: false, n: refs.length };
}
