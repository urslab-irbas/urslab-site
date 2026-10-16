// Автоматично търсене на нови цитирания (стартира се от .github/workflows/citation-scan.yml:
// веднъж месечно, ръчно от член на колектива с GitHub акаунт или от ръководителя).
//
// Какво търси:
//   1) цитирания на публикуваните трудове на колектива в Системата (dist/publications/citables.json):
//      OpenAlex (цитиращи трудове), OpenCitations COCI (цитиращи DOI), Semantic Scholar (цитиращи трудове);
//      трудове без DOI — намират се в OpenAlex по заглавие + фамилия на автора;
//   2) трудове на членовете с ORCID, които още НЕ са в Системата (OpenAlex по ORCID) — и техните цитирания.
// Правила (облекчават потвърждаването):
//   - вече въведените цитирания и самоцитиранията (за всеки член поотделно) се пропускат;
//   - цитиране на общ труд се показва веднъж — потвърждава го един от съавторите с акаунт и то се отчита на всички;
//   - всяко намерено цитиране има връзка „Потвърди“: отваря формата „Ново цитиране“ с всичко попълнено (DOI + данни);
//     потвърждението минава през всички проверки на Системата (вкл. доказателството — литературата в Crossref);
//   - вече съобщени кандидати се пазят (data: citation-scan/state.json): в следващите отчети са в кратък списък
//     „Чакат потвърждение“ до 3 месеца, след това отпадат; ново съобщение — само за нови;
//   - времето е ограничено (TIME_LIMIT) и заявките са с пауза — без натоварване на базите.
// Изход: scan-report.md (текст на заявката в GitHub), scan-report.html (имейл), scan-result.json, обновен state.json.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { latin, tnorm, parseAuthors, teamFromAuthors, cleanDoi, findDuplicate } from '../src/lib/pubSchema.js';

const SITE = process.env.SITE_URL || 'https://urs.ir.bas.bg';
const MAILTO = process.env.MAILTO || 'a.madzharov@ir.bas.bg';
const UA = `URSlab-site citation scan (+${SITE}; mailto:${MAILTO})`;
const TIME_LIMIT = Number(process.env.TIME_LIMIT_MIN || 12) * 60_000;
const STATE = process.env.STATE_FILE || 'citation-scan/state.json';
const KEEP_DAYS = 92;
const t0 = Date.now();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const timeUp = () => Date.now() - t0 > TIME_LIMIT;
const stats = { requests: 0, failed: 0, works: 0, worksNoDoi: 0, found: 0, skippedSelf: 0, skippedKnown: 0 };

async function getJson(url, { pause = 150 } = {}) {
  for (let i = 0; i < 3; i++) {
    if (timeUp()) return null;
    stats.requests++;
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/json' }, signal: AbortSignal.timeout(30000) });
      await sleep(pause);
      if (r.status === 404) return null;
      if (r.status === 429 || r.status >= 500) { await sleep(4000 * (i + 1)); continue; }
      if (!r.ok) return null;
      return await r.json();
    } catch { await sleep(2000 * (i + 1)); }
  }
  stats.failed++;
  return null;
}

// ---------------- Данни на Системата ----------------
const team = readdirSync('src/data/team')
  .filter((f) => f.endsWith('.ts') && !['index.ts', 'types.ts'].includes(f))
  .map((f) => {
    const s = readFileSync(`src/data/team/${f}`, 'utf8');
    const g = (k) => s.match(new RegExp(`${k}:\\s*'([^']*)'`))?.[1] || '';
    return { id: g('id'), github: g('github'), orcid: g('orcid'), email: g('email'), name: s.match(/name:\s*\{\s*bg:\s*'([^']+)'/)?.[1] ?? g('id') };
  })
  .filter((m) => m.id);
const citables = JSON.parse(readFileSync('dist/publications/citables.json', 'utf8'));
const sitePubs = JSON.parse(readFileSync('dist/publications/all.json', 'utf8'));
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { seen: {}, runs: [] };

// Трудовете (общите — веднъж) и чии са
const works = new Map();
for (const [m, list] of Object.entries(citables)) for (const w of list) {
  if (!works.has(w.key)) works.set(w.key, { ...w, owners: [], cites: [] });
  const x = works.get(w.key); x.owners.push(m); x.cites.push(...(w.cites ?? []));
}

// ---------------- Помощни ----------------
/** Имената „Име Фамилия“ → [{ surname, initials }] и низ в APA */
const people = (names) => names.filter(Boolean).map((n) => { const p = String(n).trim().split(/\s+/); const surname = p.pop(); return { surname, initials: p.map((q) => q[0].toUpperCase() + '.').join(' ') }; });
const apaOf = (list) => { const a = list.map((x) => `${x.surname}, ${x.initials}`.replace(/,\s*$/, '')); return a.length <= 1 ? (a[0] ?? '') : `${a.slice(0, -1).join(', ')}, & ${a[a.length - 1]}`; };
const apaFromOA = (auths) => apaOf(people((auths ?? []).map((x) => x.author?.display_name)));
const oaToCand = (w) => ({
  doi: cleanDoi(w.doi ?? '').toLowerCase(), title: w.title ?? w.display_name ?? '', year: w.publication_year,
  authors: apaFromOA(w.authorships), alist: people((w.authorships ?? []).map((x) => x.author?.display_name)), venue: w.primary_location?.source?.display_name ?? '',
  url: w.primary_location?.landing_page_url ?? w.doi ?? '', core: !!w.primary_location?.source?.is_core,
  type: w.type, source: 'OpenAlex',
});
const OA_SEL = 'id,doi,title,display_name,publication_year,authorships,primary_location,type';
const simTitle = (a, b) => { const A = new Set(latin(a).split(/[^a-z0-9]+/).filter((w) => w.length > 3)), B = new Set(latin(b).split(/[^a-z0-9]+/).filter((w) => w.length > 3)); if (!A.size || !B.size) return 0; let n = 0; for (const w of A) if (B.has(w)) n++; return n / Math.max(A.size, B.size); };

/** OpenAlex ID на труд: по DOI, иначе по заглавие + фамилия на член от колектива */
async function openAlexId(w) {
  if (w.key.startsWith('doi:')) return (await getJson(`https://api.openalex.org/works/doi:${encodeURIComponent(w.key.slice(4))}?select=id&mailto=${MAILTO}`))?.id ?? null;
  stats.worksNoDoi++;
  for (const t of [w.title, w.tr].filter(Boolean)) {
    const r = await getJson(`https://api.openalex.org/works?search=${encodeURIComponent(t)}&per-page=5&select=${OA_SEL}&mailto=${MAILTO}`);
    const hit = (r?.results ?? []).find((x) => simTitle(x.title ?? '', t) >= 0.8 && teamFromAuthors(people((x.authorships ?? []).map((a) => a.author?.display_name))).some((m) => w.owners.includes(m)));
    if (hit) return hit.id;
  }
  return null;
}
async function citingOpenAlex(oaId) {
  const out = [];
  let cursor = '*';
  while (cursor && !timeUp()) {
    const r = await getJson(`https://api.openalex.org/works?filter=cites:${oaId.split('/').pop()}&per-page=200&cursor=${cursor}&select=${OA_SEL}&mailto=${MAILTO}`);
    if (!r) break;
    out.push(...r.results.map(oaToCand));
    cursor = r.meta?.next_cursor; if (!r.results.length) break;
  }
  return out;
}
async function citingCoci(doi) {
  const r = await getJson(`https://opencitations.net/index/coci/api/v1/citations/${encodeURIComponent(doi)}`, { pause: 400 });
  return (r ?? []).map((x) => String(x.citing ?? '').replace(/^coci\s*=>\s*/, '').split(/\s+/).find((d) => d.startsWith('10.'))).filter(Boolean).map((d) => d.toLowerCase());
}
async function citingS2(doi) {
  const r = await getJson(`https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(doi)}/citations?fields=title,year,externalIds,authors,venue,url&limit=200`, { pause: 1100 });
  return (r?.data ?? []).map((x) => x.citingPaper).filter(Boolean).map((p) => ({
    doi: String(p.externalIds?.DOI ?? '').toLowerCase(), title: p.title ?? '', year: p.year,
    authors: apaOf(people((p.authors ?? []).map((q) => q.name))), alist: people((p.authors ?? []).map((q) => q.name)),
    venue: p.venue ?? '', url: p.url ?? '', source: 'Semantic Scholar',
  }));
}
/** Метаданни за DOI, намерени само от COCI (от OpenAlex на групи по 50) */
async function metaByDois(dois) {
  const out = [];
  for (let i = 0; i < dois.length && !timeUp(); i += 50) {
    const r = await getJson(`https://api.openalex.org/works?filter=doi:${dois.slice(i, i + 50).join('|')}&per-page=50&select=${OA_SEL}&mailto=${MAILTO}`);
    out.push(...(r?.results ?? []).map((w) => ({ ...oaToCand(w), source: 'OpenCitations' })));
  }
  return out;
}

// ---------------- 1) Цитирания на трудовете в Системата ----------------
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const candidates = []; // { work, cand, eligible[], confirmer, key, isNew }
const known = (w, c) => !!findDuplicate(c, w.cites) || (tnorm(c.title).length >= 15 && w.cites.some((x) => tnorm(x.title).includes(tnorm(c.title))));
function consider(w, c) {
  if (!c.title || (c.year && w.year && c.year < w.year)) return;
  const key = `${w.key}|${c.doi || tnorm(c.title).slice(0, 60)}`;
  if (candidates.some((x) => x.key === key)) return;
  if (known(w, c)) { stats.skippedKnown++; return; }
  const citingTeam = teamFromAuthors(c.alist ?? parseAuthors(c.authors).list);
  const eligible = w.owners.filter((m) => !citingTeam.includes(m));
  if (!eligible.length) { stats.skippedSelf++; return; }
  const confirmer = eligible.find((m) => team.find((t) => t.id === m)?.github) ?? eligible[0];
  candidates.push({ work: w, cand: c, eligible, confirmer, key, isNew: !state.seen[key] });
}
for (const w of works.values()) {
  if (timeUp()) break;
  stats.works++;
  const doi = w.key.startsWith('doi:') ? w.key.slice(4) : '';
  const oaId = await openAlexId(w);
  const list = oaId ? await citingOpenAlex(oaId) : [];
  if (doi) {
    const have = new Set(list.map((c) => c.doi).filter(Boolean));
    const coci = (await citingCoci(doi)).filter((d) => !have.has(d));
    if (coci.length) list.push(...await metaByDois(coci));
    for (const c of await citingS2(doi)) if (!c.doi || !list.some((x) => x.doi === c.doi)) if (!list.some((x) => simTitle(x.title, c.title) > 0.9)) list.push(c);
  }
  for (const c of list) consider(w, c);
}
stats.found = candidates.length;

// ---------------- 2) Трудове на членовете, които още не са в Системата ----------------
const newWorks = []; // { member, w (OpenAlex), cited: n }
const inSystem = (w) => !!findDuplicate({ title: w.title, doi: w.doi, authors: w.authors }, sitePubs);
for (const m of team.filter((t) => t.orcid)) {
  if (timeUp()) break;
  const a = await getJson(`https://api.openalex.org/authors/orcid:${m.orcid}?select=id&mailto=${MAILTO}`);
  if (!a?.id) continue;
  const r = await getJson(`https://api.openalex.org/works?filter=author.id:${a.id.split('/').pop()}&per-page=200&select=${OA_SEL},cited_by_count&mailto=${MAILTO}`);
  for (const w of r?.results ?? []) {
    const c = oaToCand(w);
    if (inSystem(c) || newWorks.some((x) => (x.c.doi && x.c.doi === c.doi) || tnorm(x.c.title) === tnorm(c.title))) continue;
    const coauthors = teamFromAuthors(c.alist);
    newWorks.push({ member: m.id, members: coauthors.length ? coauthors : [m.id], c, cited: w.cited_by_count ?? 0 });
  }
}

// ---------------- Отчет ----------------
const now = new Date();
const today = now.toISOString().slice(0, 10);
const nm = (id) => team.find((t) => t.id === id)?.name ?? id;
const gh = (id) => team.find((t) => t.id === id)?.github;
const confirmUrl = (x) => {
  const c = x.cand;
  const d = { type: 'citation', member: x.confirmer, cited: x.work.key, src: c.doi ? 'doi' : 'url', doi: c.doi || undefined, url: c.doi ? undefined : c.url || undefined,
    authors: c.authors, year: c.year, title: c.title, venue: c.venue, ...(c.core ? { ind: '12', index: 'wos' } : {}) };
  return `${SITE}/publications/new/?m=${x.confirmer}&cite=${encodeURIComponent(x.work.key)}#d=${b64(d)}`;
};
const newPubUrl = (x) => `${SITE}/publications/new/?m=${x.member}#d=${b64({ member: x.member, authors: x.c.authors, year: x.c.year, title: x.c.title, venue: x.c.venue, doi: x.c.doi || undefined, url: x.c.doi ? undefined : x.c.url || undefined, status: 'published' })}`;
const fresh = candidates.filter((x) => x.isNew);
const pending = candidates.filter((x) => !x.isNew && (now - Date.parse(state.seen[x.key])) / 864e5 <= KEEP_DAYS);
const cite = (c) => `${c.authors} (${c.year ?? 'б.г.'}). ${c.title}${c.venue ? `. ${c.venue}` : ''}${c.doi ? `. https://doi.org/${c.doi}` : c.url ? `. ${c.url}` : ''}`;
const workLine = (w) => `${w.authors} (${w.year}). ${w.title}`;

let md = `Автоматично търсене на нови цитирания — ${today}${process.env.TRIGGER ? ` (${process.env.TRIGGER})` : ''}.\n\n`;
md += `Източници: OpenAlex, OpenCitations (COCI), Semantic Scholar. Проверени трудове: ${stats.works} (без DOI: ${stats.worksNoDoi}). ` +
  `Пропуснати: вече въведени — ${stats.skippedKnown}, самоцитирания — ${stats.skippedSelf}. Заявки: ${stats.requests}, време: ${Math.round((Date.now() - t0) / 1000)} s.\n\n`;
md += `**Как се потвърждава:** натиснете „Потвърди“ → формата „Ново цитиране“ е попълнена → изберете показателя (Д-12 / Д-13 / Д-14) → „Запиши“ → „Create“. ` +
  `Системата проверява всичко както при ръчно въвеждане. Цитиране на общ труд потвърждава **един** от съавторите с акаунт — отчита се на всички съавтори от колектива (без тези, за които е самоцитиране).\n\n`;
const section = (list, title) => {
  if (!list.length) return '';
  let s = `## ${title} (${list.length})\n\n`;
  const byWork = new Map(); for (const x of list) { const k = x.work.key; if (!byWork.has(k)) byWork.set(k, []); byWork.get(k).push(x); }
  for (const [, xs] of byWork) {
    const w = xs[0].work;
    s += `### ${workLine(w)}\n_Отчита се на: ${xs[0].work.owners.map(nm).join(', ')}_\n\n`;
    for (const x of xs) s += `- ${cite(x.cand)} — _${x.cand.source}${x.cand.core ? ', водещо издание (предложение: Д-12)' : ''}${x.eligible.length < w.owners.length ? `; самоцитиране за ${w.owners.filter((m) => !x.eligible.includes(m)).map(nm).join(', ')}` : ''}_ · [✅ Потвърди](${confirmUrl(x)})${gh(x.confirmer) ? ` (@${gh(x.confirmer)})` : ''}\n`;
    s += '\n';
  }
  return s;
};
md += section(fresh, '🆕 Нови цитирания') || '## 🆕 Нови цитирания\n\nНяма нови цитирания от последното търсене.\n\n';
md += section(pending, '⏳ Чакат потвърждение (съобщени по-рано)');
if (newWorks.length) {
  md += `## 📄 Трудове на членовете, които още не са в Системата (${newWorks.length})\n\nНамерени в OpenAlex по ORCID. Въведете ги („+ Нова публикация“) — след това техните цитирания ще се търсят и показват тук.\n\n`;
  for (const x of newWorks) md += `- ${cite(x.c)} — ${x.members.map(nm).join(', ')}${x.cited ? `; **цитиран ${x.cited} пъти** (OpenAlex)` : ''} · [+ Въведи](${newPubUrl(x)})\n`;
  md += '\n';
}
const mention = [...new Set([...fresh, ...pending].map((x) => gh(x.confirmer)).concat(newWorks.map((x) => gh(x.member))).filter(Boolean))];
if (mention.length) md += `\n${mention.map((g) => '@' + g).join(' ')} — моля, прегледайте и потвърдете.\n`;
if (stats.failed || timeUp()) md += `\n> ⚠️ ${timeUp() ? 'Търсенето спря при ограничението за време — останалите трудове ще се проверят следващия път. ' : ''}${stats.failed ? `Неуспешни заявки: ${stats.failed}.` : ''}\n`;

// Имейл (HTML) — до всички членове с имейл, вкл. без GitHub акаунт
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const htmlList = (list) => list.map((x) => `<li>${esc(cite(x.cand))}<br><small>Труд: ${esc(workLine(x.work))} · отчита се на: ${esc(x.eligible.map(nm).join(', '))}</small><br><a href="${esc(confirmUrl(x))}">✅ Потвърди</a>${gh(x.confirmer) ? '' : ' <small>(потвърждава съавтор с акаунт или ръководителят)</small>'}</li>`).join('');
let html = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5"><h2>URSlab — нови цитирания (${today})</h2>`;
html += `<p>Проверени трудове: ${stats.works}. Нови цитирания: <b>${fresh.length}</b>; чакат потвърждение: ${pending.length}; трудове, които още не са в Системата: ${newWorks.length}.</p>`;
html += `<p>Потвърждава <b>един</b> от съавторите с GitHub акаунт (или ръководителят) — цитирането се отчита на всички съавтори от колектива. Ако нямате акаунт, препратете писмото на съавтор с акаунт или на ръководителя.</p>`;
if (fresh.length) html += `<h3>Нови цитирания</h3><ol>${htmlList(fresh)}</ol>`;
if (pending.length) html += `<h3>Чакат потвърждение</h3><ol>${htmlList(pending)}</ol>`;
if (newWorks.length) html += `<h3>Трудове, които още не са в Системата</h3><ul>${newWorks.map((x) => `<li>${esc(cite(x.c))} — ${esc(x.members.map(nm).join(', '))}${x.cited ? ` · цитиран ${x.cited} пъти` : ''} · <a href="${esc(newPubUrl(x))}">+ Въведи</a></li>`).join('')}</ul>`;
html += `<p><small>Писмото е изпратено автоматично от Системата на ${esc(SITE)}. Търсенето е веднъж месечно или ръчно от член на колектива.${String(process.env.SCAN_MAIL_TO || '') === '' ? ' Тестов режим: писмото отива само до ръководителя.' : ''}</small></p></div>`;

// Запомняне на съобщените кандидати; старите (над KEEP_DAYS) отпадат
for (const x of fresh) state.seen[x.key] = today;
for (const [k, d] of Object.entries(state.seen)) if ((now - Date.parse(d)) / 864e5 > KEEP_DAYS * 2) delete state.seen[k];
state.lastRun = now.toISOString();
state.runs = [...(state.runs ?? []), { date: now.toISOString(), trigger: process.env.TRIGGER ?? '', new: fresh.length, pending: pending.length, newWorks: newWorks.length, requests: stats.requests, seconds: Math.round((Date.now() - t0) / 1000) }].slice(-24);
mkdirSync(STATE.split('/').slice(0, -1).join('/') || '.', { recursive: true });
writeFileSync(STATE, JSON.stringify(state, null, 2) + '\n');
writeFileSync('scan-report.md', md);
writeFileSync('scan-report.html', html);
// Получатели: засега (тестов режим) само ръководителят. За всички членове с имейл в профила:
// задайте в GitHub → Settings → Secrets and variables → Actions → Variables: SCAN_MAIL_TO = all
// (или списък с адреси, разделени със запетая).
const MAIL_TO = String(process.env.SCAN_MAIL_TO || '').trim();
const emails = MAIL_TO === 'all' ? team.map((t) => t.email).filter(Boolean)
  : MAIL_TO ? MAIL_TO.split(/[,;\s]+/).filter(Boolean)
  : [team.find((t) => t.id === 'madzharov')?.email || MAILTO];
writeFileSync('scan-result.json', JSON.stringify({ fresh: fresh.length, pending: pending.length, newWorks: newWorks.length, emails, stats }, null, 2));
console.log(md);
