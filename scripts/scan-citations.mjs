// Автоматично търсене на нови цитирания (стартира се от .github/workflows/citation-scan.yml:
// веднъж месечно, ръчно от член на колектива с GitHub акаунт или от ръководителя).
//
// Какво търси:
//   1) цитирания на публикуваните трудове на колектива в Системата (dist/publications/citables.json):
//      OpenAlex (цитиращи трудове), OpenCitations COCI (цитиращи DOI), Semantic Scholar (цитиращи трудове);
//      трудове без DOI — намират се в OpenAlex по заглавие + фамилия на автора;
//      наблюдение на списанията на БАН (journal-watch.mjs): литературата или пълният текст (PDF/HTML) на новите статии,
//      защото повечето списания на БАН не изпращат литературата си в Crossref;
//   2) трудове на членовете с ORCID, които още НЕ са в Системата (OpenAlex по ORCID) — и техните цитирания.
// Правила (облекчават потвърждаването):
//   - вече въведените цитирания и самоцитиранията (за всеки член поотделно) се пропускат;
//   - цитиране на общ труд се показва веднъж — потвърждава го един от съавторите с акаунт и то се отчита на всички;
//   - всяко намерено цитиране с DOI се проверява предварително както при потвърждаване (Crossref: данни и литература;
//     правилата на Системата и на НАЦИД); готовите се потвърждават с ЕДНА отметка в заявката (показател или „Откажи“) —
//     .github/workflows/citation-confirm.yml ги въвежда без формата; останалите — през формата (?scan=<id>) или „Откажи“;
//   - отказаните (state.rejected) не се предлагат повече; потвърдените (state.confirmed) се пропускат до въвеждането им;
//   - вече съобщени кандидати се показват отново (с дата на съобщаване) до 3 месеца; предишната заявка се затваря;
//   - времето е ограничено (TIME_LIMIT, VERIFY_LIMIT) и заявките са с пауза — без натоварване на базите.
// Изход: scan-report-parts.json (текстът на заявката/заявките в GitHub), scan-report.md, scan-report.html (имейл),
//        scan-result.json, citation-scan/candidates.json (данните за отметките и формата), обновен state.json.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { latin, tnorm, parseAuthors, teamFromAuthors, cleanDoi, findDuplicate, validateCitation, CIT_POINTS, MESSAGES } from '../src/lib/pubSchema.js';
import { crossrefWork, fromCrossref, findInRefs } from './evidence.mjs';
import { loadIndexLists, classify, listsSummary } from './index-lists.mjs';
import { nrsByNumber } from './verify-ids.mjs';
import { watchJournals, loadWatch, SOURCES } from './journal-watch.mjs';

const SITE = process.env.SITE_URL || 'https://urs.ir.bas.bg';
const MAILTO = process.env.MAILTO || 'a.madzharov@ir.bas.bg';
const UA = `URSlab-site citation scan (+${SITE}; mailto:${MAILTO})`;
const TIME_LIMIT = Number(process.env.TIME_LIMIT_MIN || 12) * 60_000;
const STATE = process.env.STATE_FILE || 'citation-scan/state.json';
const CANDS = process.env.CANDS_FILE || 'citation-scan/candidates.json';
const VERIFY_LIMIT = Number(process.env.VERIFY_LIMIT_MIN || 8) * 60_000;
const KEEP_DAYS = 92;
const t0 = Date.now();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const timeUp = () => Date.now() - t0 > TIME_LIMIT;
// Б1: списъци за индексиране (Scopus, WoS, други бази) от клона data, citation-scan/index/ — виж index-lists.mjs
const lists = await loadIndexLists();
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
state.rejected ??= {}; // отказани с отметка „Откажи“ — не се предлагат повече
state.confirmed ??= {}; // потвърдени с отметка — до въвеждането им се пропускат

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
  issns: w.primary_location?.source?.issn ?? [], doaj: !!w.primary_location?.source?.is_in_doaj,
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
const candidates = []; // { work, cand, eligible[], confirmer, key, isNew }
const known = (w, c) => !!findDuplicate(c, w.cites) || (tnorm(c.title).length >= 15 && w.cites.some((x) => tnorm(x.title).includes(tnorm(c.title))));
function consider(w, c) {
  if (!c.title || (c.year && w.year && c.year < w.year)) return;
  const key = `${w.key}|${c.doi || tnorm(c.title).slice(0, 60)}`;
  if (candidates.some((x) => x.key === key)) return;
  if (known(w, c)) { stats.skippedKnown++; return; }
  if (state.rejected[key] || state.confirmed[key]) { stats.skippedDecided = (stats.skippedDecided ?? 0) + 1; return; }
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


// ---------------- 2б) Наблюдение на списанията на БАН (пълен текст) ----------------
const JW_FILE = process.env.JW_FILE || 'citation-scan/journal-watch.json';
const jw = loadWatch(JW_FILE);
const jwStats = await watchJournals(works, jw, { timeLimitMs: Number(process.env.JW_TIME_MIN || 8) * 60_000, since: process.env.JW_SINCE || SOURCES.since, log: (t) => console.error(t) });
writeFileSync(JW_FILE, JSON.stringify(jw) + '\n');
for (const h of Object.values(jw.hits ?? {})) {
  const w = works.get(h.cited);
  if (w) consider(w, { ...h.cand, source: `списание на БАН (${h.source})`, jw: h });
}
stats.found = candidates.length;

// ---------------- 3) Предварителна проверка — същата като при потвърждаване ----------------
// За всяко цитиране с DOI: данните от Crossref, търсене на цитирания труд в литературата на цитиращия
// и правилата на Системата (validateCitation). Готовите се потвърждават с една отметка в заявката в GitHub
// (.github/workflows/citation-confirm.yml) — без формата. Останалите — през формата (линк / PDF) или „Откажи“.
const now = new Date();
const today = now.toISOString().slice(0, 10);
const id8 = (k) => createHash('sha1').update(k).digest('hex').slice(0, 8);
const shown = candidates.filter((x) => x.isNew || (now - Date.parse(state.seen[x.key])) / 864e5 <= KEEP_DAYS);
const BOOKISH = ['proceedings-article', 'book-chapter', 'book', 'monograph', 'edited-book', 'reference-book', 'book-part', 'book-section', 'book-set', 'proceedings'];
const NOT_COUNTED = { 'posted-content': 'предпечат (preprint)', dataset: 'набор от данни', 'peer-review': 'рецензия в платформа', dissertation: 'дисертация', report: 'доклад / отчет' };
const tv = Date.now();
for (const x of shown) {
  const c = x.cand;
  x.id = id8(x.key);
  x.data = { type: 'citation', member: x.eligible[0], cited: x.work.key, src: c.doi ? 'doi' : 'url', ...(c.doi ? { doi: c.doi } : c.url ? { url: c.url } : {}),
    authors: c.authors, year: c.year, title: c.title, venue: c.venue };
  x.status = 'form';
  if (!c.doi) {
    x.why = 'няма DOI — доказателство с линк или PDF файл';
    // Б2: показател по списъците и за кандидатите без DOI — попълва се във формата (рецензирането потвърждава членът)
    const kindNoDoi = ['article', 'review', 'letter'].includes(c.type) ? 'journal' : ['book-chapter', 'proceedings-article', 'book', 'monograph', 'edited-book', 'proceedings'].includes(c.type) ? 'book' : '';
    x.idx = classify(lists, { issns: c.issns ?? [], year: c.year, kind: kindNoDoi, doaj: c.doaj, venue: c.venue });
    const sgf = x.idx.suggest;
    if (sgf) {
      x.data.ind = sgf.startsWith('12') ? '12' : sgf;
      if (sgf.startsWith('12')) x.data.index = sgf === '12w' ? 'wos' : 'scopus';
      if (sgf === '14' && x.idx.issns[0]) { x.data.idType = 'issn'; x.data.idValue = x.idx.issns[0]; }
    }
    continue;
  }
  if (Date.now() - tv > VERIFY_LIMIT) { x.why = 'не е проверено поради ограничението за време — ще се провери при следващото търсене'; continue; }
  let m = null;
  try { stats.requests++; m = await crossrefWork(c.doi); } catch { x.why = 'Crossref не отговори'; continue; }
  if (m) {
    const cr = fromCrossref(m);
    for (const [k, v] of Object.entries(cr)) x.data[k] = v; // Crossref е източникът на библиографските данни (като при потвърждаването)
    x.ctype = m.type;
    if (NOT_COUNTED[m.type]) { x.status = 'doubt'; x.why = `вид „${NOT_COUNTED[m.type]}“ — по правилата на НАЦИД не се отчита`; continue; }
    const refs = m.reference ?? [];
    if (refs.length) {
      let f = null;
      for (const o of x.work.owners) { const r = findInRefs(refs, x.work, o); if (r.found) { f = r; break; } }
      if (!f) { x.status = 'doubt'; x.why = `трудът не е намерен в литературата на цитиращия (Crossref: ${refs.length} позиции) — вероятно грешка в базата; ако все пак е цитиран, въведете с PDF файл`; continue; }
      x.data.where = `[${f.pos}]`;
      x.ev = `в литературата: позиция ${f.pos} от ${refs.length} (Crossref)`;
    } else x.ev = 'DOI в Crossref (литературата не е публикувана там)';
  } else x.ev = 'DOI извън Crossref (DataCite / doi.org)';
  // наблюдение на списанията: доказателството е пълният текст (линкът към PDF/HTML) — проверява се отново при потвърждаването
  if (c.jw) {
    x.ev = `в пълния текст: ${c.jw.how}`;
    if (!/литература в Crossref/.test(c.jw.source)) { x.data.src = 'url'; x.data.url = c.jw.url; }
  }
  // Правилата на Системата; автоматично взето поле в неподходящ формат не пречи — просто не се записва
  const ctx = { cited: { title: x.work.title, year: x.work.year, authors: x.work.authors }, existing: x.work.cites, full: true };
  const test = () => validateCitation({ ...x.data, ind: '13', peer: true }, ctx);
  let errs = test();
  for (const e of errs.filter((e) => ['fmt', 'issn', 'isbn'].includes(e.code))) { if (['idValue', 'idType'].includes(e.field)) { delete x.data.idType; delete x.data.idValue; } else delete x.data[e.field]; }
  errs = test();
  if (errs.length) { x.why = `за допълване във формата: ${errs.map((e) => `${e.field} — ${MESSAGES.bg[e.code] ?? e.code}`).join('; ')}`; continue; }
  const journal = m ? m.type === 'journal-article' : !!x.data.venue;
  const issn = ['issn', 'eissn'].includes(x.data.idType);
  x.options = ['12s', '12w', ...(journal ? (issn ? ['14'] : []) : (!m || BOOKISH.includes(m.type) ? ['13'] : []))];
  // Б1: индексиране по ISSN и година → един предложен показател с основание (останалите отметки остават за поправка)
  const kind = journal ? 'journal' : (!m || BOOKISH.includes(m.type) ? 'book' : '');
  const issns = [...(m?.ISSN ?? []), ...(c.issns ?? []), ...(issn ? [x.data.idValue] : [])];
  const isbns = [...(m?.ISBN ?? []), ...(x.data.idType?.includes('isbn') ? [x.data.idValue] : [])];
  x.idx = classify(lists, { issns, isbns, year: x.data.year ?? c.year, kind, doaj: c.doaj, venue: x.data.venue || c.venue || (m?.['container-title'] ?? [])[0] });
  const sg = x.idx.suggest;
  if (sg === '14' && !issn) { x.data.idType = 'issn'; x.data.idValue = x.idx.issns[0]; } // Д-14 изисква ISSN на списанието
  if (sg) x.options = [sg, ...x.options.filter((o) => o !== sg)];
  // Б2: за Д-13 / Д-14 — дали изданието е в НРС на НАЦИД (рецензирано по определение)
  if (['13', '14'].includes(sg)) for (const n of [...new Set([...x.idx.issns, ...(m?.ISBN ?? [])])].slice(0, 3)) {
    try { stats.requests++; const r = await nrsByNumber(n); if (r) { x.idx.why += `; в НРС на НАЦИД (ID ${r.id}) — рецензирано`; break; } } catch { break; }
  }
  x.status = 'ready';
}

// ---------------- Отчет ----------------
const nm = (id) => team.find((t) => t.id === id)?.name ?? id;
const gh = (id) => team.find((t) => t.id === id)?.github;
const OPT = {
  '12s': `Д-12 · Scopus (${CIT_POINTS[12]} т.)`,
  '12w': `Д-12 · Web of Science (${CIT_POINTS[12]} т.)`,
  13: `Д-13 · сборник / монография с рецензиране, без Scopus и WoS (${CIT_POINTS[13]} т.)`,
  14: `Д-14 · списание с рецензиране, без Scopus и WoS (${CIT_POINTS[14]} т.)`,
  x: '❌ Откажи — не е цитиране или не се отчита (няма да се предлага повече)',
};
const box = (x, o) => `  - [ ] ${OPT[o]}${x.idx?.suggest === o ? ` ← **предложено:** ${x.idx.why}` : ''} <!--c:${x.id}:${o}-->`;
const formUrl = (x) => `${SITE}/publications/new/?m=${x.data.member}&cite=${encodeURIComponent(x.work.key)}&scan=${x.id}`;
const newPubUrl = (x) => `${SITE}/publications/new/?m=${x.member}#d=${Buffer.from(JSON.stringify({ member: x.member, authors: x.c.authors, year: x.c.year, title: x.c.title, venue: x.c.venue, doi: x.c.doi || undefined, url: x.c.doi ? undefined : x.c.url || undefined, status: 'published' })).toString('base64url')}`;
const cite = (c) => `${c.authors} (${c.year ?? 'б.г.'}). ${c.title}${c.venue ? `. *${c.venue}*` : ''}${c.doi ? `. https://doi.org/${c.doi}` : c.url ? `. ${c.url}` : ''}`;
const workLine = (w) => `${w.authors} (${w.year}). ${w.title}`;
const selfNote = (x) => x.eligible.length < x.work.owners.length ? `; самоцитиране за ${x.work.owners.filter((m) => !x.eligible.includes(m)).map(nm).join(', ')} — отчита се на останалите` : '';
const ready = shown.filter((x) => x.status === 'ready');
const form = shown.filter((x) => x.status === 'form');
const doubt = shown.filter((x) => x.status === 'doubt');
const fresh = shown.filter((x) => x.isNew);

const chunks = []; // части на текста — при над 60 000 знака заявката се разделя на няколко
let head = `Автоматично търсене на нови цитирания — ${today}${process.env.TRIGGER ? ` (${process.env.TRIGGER})` : ''}.\n\n`;
head += `${listsSummary(lists)}\n\n`;
head += `Източници: OpenAlex, OpenCitations (COCI), Semantic Scholar; списания на БАН — ${jwStats.members} източника от ${SOURCES.sources.length}, нови статии ${jwStats.works} (литература в Crossref ${jwStats.refs}, PDF ${jwStats.pdf}, HTML ${jwStats.html}, без текст ${jwStats.noText}), намерени цитирания ${jwStats.hits}${jwStats.unfinished.length ? `; продължава при следващото търсене: ${jwStats.unfinished.length} издатели` : ''}; проверка — Crossref. Проверени трудове: ${stats.works} (без DOI: ${stats.worksNoDoi}). ` +
  `Пропуснати: вече въведени — ${stats.skippedKnown}, самоцитирания — ${stats.skippedSelf}, вече решени (потвърдени / отказани) — ${stats.skippedDecided ?? 0}. Заявки: ${stats.requests}, време: ${Math.round((Date.now() - t0) / 1000)} s.\n\n`;
head += `> **Как се потвърждава:** под всяко цитиране отметнете **една** отметка — показателя (Д-12, ако цитиращият труд е в Scopus или Web of Science; иначе Д-13 / Д-14) или „❌ Откажи“. Ако Системата е определила показателя по списъците, той е първи и е отбелязан „← предложено“ с основанието; другите отметки са за поправка. ` +
  `Системата проверява и въвежда цитирането сама (без формата) — на всички съавтори от колектива, без тези, за които е самоцитиране — и след минута-две пише резултата на мястото на отметките. ` +
  `Отметки слагат съавторите на цитирания труд с GitHub акаунт и ръководителят.\n\n`;
chunks.push(head);
const groups = (list, render) => {
  const by = new Map(); for (const x of list) { if (!by.has(x.work.key)) by.set(x.work.key, []); by.get(x.work.key).push(x); }
  for (const [, xs] of by) {
    chunks.push(`### ${workLine(xs[0].work)}\n_Отчита се на: ${xs[0].work.owners.map(nm).join(', ')}_\n\n`);
    for (const x of xs) chunks.push(render(x));
  }
};
const meta = (x) => [x.cand.source, x.ev, x.idx && !x.idx.suggest ? x.idx.why : '', x.idx?.other?.length ? `други бази: ${x.idx.other.join(', ')}` : '', x.cand.core && !lists.dbs.has('scopus') ? 'OpenAlex: водещо издание — вероятно Д-12' : '', x.isNew ? '' : `съобщено на ${state.seen[x.key]}`].filter(Boolean).join(' · ') + selfNote(x);
if (ready.length) {
  chunks.push(`## ✅ Проверени — потвърдете с една отметка (${ready.length})\n\n`);
  groups(ready, (x) => `- ${cite(x.cand)}\n  <sub>✔ ${meta(x)}</sub>\n${[...x.options, 'x'].map((o) => box(x, o)).join('\n')}\n\n`);
}
if (form.length) {
  chunks.push(`## ✍️ За въвеждане през формата (${form.length})\n\nТези не могат да се проверят автоматично — натиснете „Формата“ (данните са попълнени), добавете доказателство (линк или PDF файл) и изберете показателя.\n\n`);
  groups(form, (x) => `- ${cite(x.cand)}\n  <sub>${x.why}${x.idx?.suggest ? ` · **предложено във формата:** ${OPT[x.idx.suggest].split(' (')[0]} — ${x.idx.why}` : ''} · ${meta(x)}</sub> · [✍️ Формата](${formUrl(x)})\n${box(x, 'x')}\n\n`);
}
if (doubt.length) {
  chunks.push(`## ⚠️ Съмнителни (${doubt.length})\n\nБазите ги посочват като цитирания, но проверката не ги потвърждава. Обикновено — „❌ Откажи“.\n\n`);
  groups(doubt, (x) => `- ${cite(x.cand)}\n  <sub>⚠️ ${x.why} · ${x.cand.source}</sub> · [✍️ Формата](${formUrl(x)})\n${box(x, 'x')}\n\n`);
}
if (!shown.length) chunks.push('## Нови цитирания\n\nНяма нови цитирания от последното търсене.\n\n');
if (newWorks.length) {
  chunks.push(`## 📄 Трудове на потребителите, които още не са в Системата (${newWorks.length})\n\nНамерени в OpenAlex по ORCID. Въведете ги („+ Въведи“) — след това и техните цитирания ще се търсят.\n\n`);
  for (const x of newWorks) chunks.push(`- ${cite(x.c)} — ${x.members.map(nm).join(', ')}${x.cited ? `; **цитиран ${x.cited} пъти** (OpenAlex)` : ''} · [+ Въведи](${newPubUrl(x)})\n`);
  chunks.push('\n');
}
const mention = [...new Set([...shown.flatMap((x) => x.work.owners.map(gh)), ...newWorks.map((x) => gh(x.member))].filter(Boolean))];
let tail = '';
if (mention.length) tail += `\n${mention.map((g) => '@' + g).join(' ')} — моля, прегледайте.\n`;
if (stats.failed || timeUp()) tail += `\n> ⚠️ ${timeUp() ? 'Търсенето спря при ограничението за време — останалите трудове ще се проверят следващия път. ' : ''}${stats.failed ? `Неуспешни заявки: ${stats.failed}.` : ''}\n`;
// Разделяне на части (GitHub приема до 65 536 знака в заявка)
const MAX = 58000;
const parts = [''];
for (const ch of chunks) {
  if (parts[parts.length - 1].length + ch.length > MAX) parts.push(`(продължение)\n\n`);
  parts[parts.length - 1] += ch;
}
parts[parts.length - 1] += tail;

// Имейл (HTML): кратко + връзка към заявката (__ISSUES__ се заменя в workflow с връзките).
// Ръководителят получава всичко; всеки потребител — само своята част (цитиранията, които се отчитат на него, и неговите
// трудове, които още не са в Системата).
const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const htmlList = (list) => list.map((x) => `<li>${esc(cite(x.cand).replace(/\*/g, ''))}<br><small>Труд: ${esc(workLine(x.work))} · отчита се на: ${esc(x.eligible.map(nm).join(', '))}${x.why ? ` · ${esc(x.why)}` : ''}</small></li>`).join('');
const FOOT = `<p><small>Писмото е изпратено автоматично от Системата на ${esc(SITE)}. Търсенето е веднъж месечно и с бутона „Търси нови цитирания“ в „Обобщен отчет“. Ръководителят получава целия резултат, всеки потребител — само своята част.</small></p></div>`;
function mailHtml(member) {
  const mine = (list) => member ? list.filter((x) => x.eligible.includes(member)) : list;
  const r = mine(ready), f = mine(form), d = mine(doubt), nw = member ? newWorks.filter((x) => x.members.includes(member)) : newWorks;
  const n = r.length + f.length + d.length;
  let h = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5"><h2>URSlab — нови цитирания (${today})${member ? ` — ${esc(nm(member))}` : ''}</h2>`;
  if (member) h += `<p>Цитирания на ваши трудове: <b>${n}</b> — готови за потвърждаване с отметка: <b>${r.length}</b>; за формата: ${f.length}; съмнителни: ${d.length}. Ваши трудове, които още не са в Системата: ${nw.length}.</p>`;
  else h += `<p>Проверени трудове: ${stats.works}. Намерени цитирания: <b>${shown.length}</b> (нови: ${fresh.length}) — готови за потвърждаване с отметка: <b>${ready.length}</b>; за формата: ${form.length}; съмнителни: ${doubt.length}. Трудове, които още не са в Системата: ${newWorks.length}.</p>`;
  if (n || !member) {
    h += `<p style="font-size:16px"><b>👉 Потвърждаване с една отметка: __ISSUES__</b></p>`;
    h += `<p>Потвърждава <b>един</b> от съавторите с GitHub акаунт (или ръководителят) — цитирането се отчита на всички съавтори от колектива. Ако нямате акаунт, препратете писмото на съавтор с акаунт или на ръководителя.</p>`;
  } else h += `<p>Няма нови цитирания на ваши трудове от последното търсене. Пълният резултат: __ISSUES__</p>`;
  if (r.length) h += `<h3>Проверени</h3><ol>${htmlList(r)}</ol>`;
  if (f.length) h += `<h3>За въвеждане през формата</h3><ol>${htmlList(f)}</ol>`;
  if (d.length) h += `<h3>Съмнителни</h3><ol>${htmlList(d)}</ol>`;
  if (nw.length) h += `<h3>Трудове, които още не са в Системата</h3><ul>${nw.map((x) => `<li>${esc(cite(x.c).replace(/\*/g, ''))} — ${esc(x.members.map(nm).join(', '))}${x.cited ? ` · цитиран ${x.cited} пъти` : ''} · <a href="${esc(newPubUrl(x))}">+ Въведи</a></li>`).join('')}</ul>`;
  return { html: h + FOOT, n, ready: r.length, works: nw.length };
}
const html = mailHtml(null).html;

// Кандидатите (за отметките и за формата ?scan=<id>) и състоянието
const items = {};
for (const x of shown) items[x.id] = { key: x.key, cited: x.work.key, owners: x.work.owners, eligible: x.eligible, status: x.status, options: x.options ?? [], suggest: x.idx?.suggest, why: x.idx?.why, data: x.data, evidence: x.ev ?? '', line: cite(x.cand).replace(/\*/g, ''), work: workLine(x.work) };
mkdirSync(CANDS.split('/').slice(0, -1).join('/') || '.', { recursive: true });
writeFileSync(CANDS, JSON.stringify({ date: today, items }, null, 1) + '\n');
for (const x of shown) state.seen[x.key] ??= today;
for (const [k, d] of Object.entries(state.seen)) if ((now - Date.parse(d)) / 864e5 > KEEP_DAYS * 2) delete state.seen[k];
for (const [k, v] of Object.entries(state.confirmed)) if ((now - Date.parse(v.date)) / 864e5 > 31) delete state.confirmed[k];
state.lastRun = now.toISOString();
state.runs = [...(state.runs ?? []), { date: now.toISOString(), trigger: process.env.TRIGGER ?? '', found: shown.length, new: fresh.length, ready: ready.length, form: form.length, doubt: doubt.length, newWorks: newWorks.length, suggested: Object.fromEntries(['12s', '12w', '13', '14'].map((o) => [o, ready.filter((x) => x.idx?.suggest === o).length])), lists: [...lists.dbs.keys()], journalWatch: jwStats, requests: stats.requests, seconds: Math.round((Date.now() - t0) / 1000) }].slice(-24);
mkdirSync(STATE.split('/').slice(0, -1).join('/') || '.', { recursive: true });
writeFileSync(STATE, JSON.stringify(state, null, 2) + '\n');
writeFileSync('scan-report.md', parts.join('\n\n---\n\n'));
writeFileSync('scan-report-parts.json', JSON.stringify(parts));
writeFileSync('scan-report.html', html);
// Получатели (писмата се пращат от scripts/send-mails.py):
//   SCAN_MAIL_TO    — еднократно (ред „Имейл: …“ на ръководителя / mail_to): целият резултат само до тези адреси;
//   SCAN_MAIL_USERS — 'all' (месечното търсене): всеки потребител със своя част (само ако в нея има нещо);
//                     '<id>' (бутонът в „Обобщен отчет“ на потребителя): неговата част (и когато е празна); '' — никой;
//   ръководителят получава целия резултат (при месечното търсене — само ако има резултат).
// Имейл на потребителя: поле email в профила или тайната MEMBER_EMAILS („id=адрес; id=адрес“).
const extraMail = Object.fromEntries(String(process.env.MEMBER_EMAILS || '').split(/[;\n]+/).map((x) => x.split('=').map((y) => y.trim())).filter((x) => x[0] && /@/.test(x[1] || '')));
const mailOf = (id) => team.find((t) => t.id === id)?.email || extraMail[id] || '';
const headMail = team.find((t) => t.id === 'madzharov')?.email || MAILTO;
const total = shown.length + newWorks.length;
const once = String(process.env.SCAN_MAIL_TO || '').trim();
const users = String(process.env.SCAN_MAIL_USERS || '').trim();
const mails = [];
const subj = (n, r) => `URSlab: нови цитирания (${n}; за потвърждаване с отметка: ${r})`;
if (once) mails.push({ to: once.split(/[,;\s]+/).filter(Boolean), subject: subj(fresh.length, ready.length), file: 'scan-report.html' });
else {
  if (total || users !== 'all') mails.push({ to: [headMail], subject: subj(fresh.length, ready.length), file: 'scan-report.html' });
  const ids = users === 'all' ? team.map((t) => t.id) : users ? [users] : [];
  for (const id of ids) {
    const to = mailOf(id);
    if (!to || to === headMail) continue; // ръководителят вече има целия резултат
    const m = mailHtml(id);
    if (!m.n && !m.works && users === 'all') continue; // месечното търсене: писмо само ако има нещо за потребителя
    writeFileSync(`scan-report-${id}.html`, m.html);
    mails.push({ to: [to], subject: m.n ? subj(m.n, m.ready) : 'URSlab: търсене на цитирания — няма нови за вашите трудове', file: `scan-report-${id}.html`, user: id });
  }
}
writeFileSync('scan-mails.json', JSON.stringify(mails, null, 1));
const emails = [...new Set(mails.flatMap((m) => m.to))];
const personal = mails.filter((m) => m.user).map((m) => m.user);
writeFileSync('scan-result.json', JSON.stringify({ found: shown.length, fresh: fresh.length, ready: ready.length, form: form.length, doubt: doubt.length, newWorks: newWorks.length, parts: parts.length, emails, personal, stats }, null, 2));
console.log(parts.join('\n\n---\n\n'));
