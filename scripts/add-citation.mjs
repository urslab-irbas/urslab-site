// Стартира се от .github/workflows/citation.yml при нова/редактирана заявка „[Цитиране] …“ (формата на сайта в режим „Ново цитиране“).
// 1) Проверява, че заявката е от GitHub акаунта на члена на колектива, чийто е цитираният труд (или от ръководителя).
// 2) Намира цитирания труд сред публикуваните трудове на члена (dist/publications/citables.json — сайтът е изграден преди това).
// 3) Проверява цитирането с правилата за нова публикация + правилата на НАЦИД (src/lib/pubSchema.js → validateCitation):
//    без самоцитиране, година, показател (Д-12 — Scopus/WoS, Д-14 — ISSN), доказателство „къде“, без повторно въвеждане.
// 4) Доказателство (scripts/evidence.mjs): при DOI — данните и литературата от Crossref; при линк — страницата / PDF файлът;
//    при PDF — файлът, прикачен към заявката. Приема се само ако цитираният труд се намира в цитиращия.
// 5) Проверява DOI / ISSN / ISBN на цитиращия труд в публичните регистри (scripts/verify-ids.mjs).
// 6) При успех го добавя в src/data/citations/<член>/contrib.json на ВСЕКИ съавтор от колектива на цитирания труд (без самоцитиранията;
//    достатъчно е потвърждение от един от тях) и в дневника publish-log.md (клон data). Резултатът е в pub-result.json.
// Локален тест: ISSUE_BODY="$(cat body.md)" ISSUE_AUTHOR=urslab-irbas ISSUE_NUMBER=1 node scripts/add-citation.mjs
import { readFileSync, writeFileSync, readdirSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { isYes, validateCitation, normalizeCitation, MESSAGES, cleanDoi, parseAuthors, teamFromAuthors, findDuplicate, tnorm } from '../src/lib/pubSchema.js';
import { verifyEntry, nrsByNumber } from './verify-ids.mjs';
import { crossrefWork, fromCrossref, urlText, attachmentUrl, findCited, findInRefs, hasTitle } from './evidence.mjs';
import { loadIndexLists, classify } from './index-lists.mjs';

const SITE = process.env.SITE_URL || 'https://urs.ir.bas.bg';
const ADMIN = (process.env.ADMIN_LOGIN || 'urslab-irbas').toLowerCase();
const body = process.env.ISSUE_BODY || '';
const author = (process.env.ISSUE_AUTHOR || '').toLowerCase();
const issue = Number(process.env.ISSUE_NUMBER || 0);
const M = MESSAGES.bg;

const result = { ok: false, authorized: false, errors: [], howto: [], apa: '', fixUrl: `${SITE}/team/`, title: '', verified: [], member: '', cited: '', members: [] };
const HOW = {
  required: 'попълнете полето.',
  citpeer: 'отметнете „Изданието е с научно рецензиране“ под показателя (само ако е вярно); ако не е рецензирано, цитирането не носи точки по Д-13 / Д-14.',
  fmt: 'поправете записа по примера под полето във формата.',
  empty: 'въведете авторите на цитиращия труд.',
  format: 'запишете авторите в APA: „Фамилия, И.“, разделени със запетая, „&“ преди последния.',
  'amp-missing': 'поставете „&“ преди последния автор.',
  'amp-many': 'оставете само един знак „&“ — преди последния автор.',
  short: 'въведете пълното заглавие на цитиращия труд.',
  caps: 'напишете заглавието с нормални малки и главни букви.',
  selfcite: 'самоцитиранията не се отчитат по правилата на НАЦИД — не въвеждайте това цитиране.',
  citerange: 'въвеждайте само вече публикувани цитиращи трудове.',
  citeyear: 'проверете годината на цитиращия труд — не може да е преди годината на цитирания.',
  citevenue: 'попълнете „Списание / сборник“ или „Издател“.',
  cit12index: 'изберете Scopus или Web of Science в „Индексиран в“; ако цитиращият труд не е в тези бази, изберете Д-13 или Д-14.',
  cit14issn: 'Д-14 е за списания — изберете ISSN / eISSN и въведете номера; ако е сборник или монография, изберете Д-13.',
  citewhere: 'посочете номера на вашия труд в литературата на цитиращия труд и/или страницата (напр. „[27], с. 136“).',
  citedup: 'това цитиране вече е въведено — не го въвеждайте отново.',
  evsrc: 'изберете във формата „DOI“, „Линк“ или „PDF файл“.',
  evnotfound: 'проверете дали това е правилният цитиращ труд и дали в него наистина е цитиран вашият труд. Ако е цитиран с друго изписване, прикачете PDF файла на цитиращия труд (вариант „PDF файл“); ако и тогава не се намира — пишете на ръководителя в тази заявка.',
  evmismatch: 'проверете линка / файла — трябва да е на цитиращия труд, посочен във формата.',
  evunreach: 'сайтът не дава достъп за проверка — изберете „PDF файл“ и прикачете файла на цитиращия труд към заявката.',
  evnopdf: 'отворете заявката отново от формата и преди „Create“ плъзнете PDF файла в полето на заявката (над блока с данни).',
  doimeta: 'попълнете във формата авторите, годината, заглавието и изданието на цитиращия труд.',
  citednf: 'отворете „Обобщен отчет“, натиснете бутона „Цитирания“ под годината на труда и после „+ Цитиране“.',
  issn: 'въведете само номера на ISSN (8 знака, напр. 1314-8540); проверете го в https://portal.issn.org',
  isbn: 'въведете само номера на ISBN (10 или 13 цифри), без друг текст.',
  idneeded: 'ако няма DOI, изберете вид идентификатор (ISSN, eISSN, ISBN или eISBN) и въведете номера.',
  notfound: 'проверете номера (сайт на издателя, https://portal.issn.org, https://nrs.nacid.bg). Ако изданието го няма в регистрите, пишете на ръководителя в тази заявка.',
  idmismatch: 'номерът е на изданието, посочено по-горе. Ако това е вашето издание, напишете в „Списание / сборник“ името му, както е в регистъра; ако не е — въведете правилния ISSN/ISBN.',
  doititle: 'DOI е на публикацията с посоченото заглавие. Проверете DOI (отворете https://doi.org/…) и заглавието във формата.',
  unavailable: 'регистърът временно не отговаря — не е ваша грешка. Опитайте отново след около час със същата връзка.',
};
const fieldName = { peer: 'Научно рецензиране', src: 'Доказателство', cited: 'Цитиран труд', authors: 'Автори', year: 'Година', title: 'Заглавие', venue: 'Списание / сборник', volume: 'Том', pages: 'Страници', publisher: 'Издател', doi: 'DOI', idType: 'Вид идентификатор', idValue: 'ISSN / ISBN', url: 'Линк', ind: 'Показател', index: 'Индексиран в', where: 'Къде е цитирането' };
const done = () => {
  writeFileSync('pub-result.json', JSON.stringify(result, null, 2));
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `ok=${result.ok}\nauthorized=${result.authorized}\nmember=${result.member}\n`);
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
};

// --- Колектив: id и GitHub акаунт от src/data/team/*.ts
const team = readdirSync('src/data/team')
  .filter((f) => f.endsWith('.ts') && !['index.ts', 'types.ts'].includes(f))
  .map((f) => { const s = readFileSync(`src/data/team/${f}`, 'utf8'); return { id: s.match(/id:\s*'([^']+)'/)?.[1], github: s.match(/github:\s*'([^']+)'/)?.[1]?.toLowerCase() }; })
  .filter((m) => m.id && m.github);

// --- Данните от заявката
const block = body.match(/```json\s*([\s\S]*?)```/);
let data;
try { data = JSON.parse(block?.[1] ?? ''); } catch { /* по-долу */ }
if (!data || typeof data !== 'object' || data.type !== 'citation') {
  result.errors.push('Липсва или е повреден блокът с данни. Въведете цитирането отново през формата на сайта (бутон „+ Цитиране“ в „Обобщен отчет“).');
  done();
}
result.member = /^[a-z]+$/.test(String(data.member)) ? data.member : '';
result.cited = String(data.cited ?? '');

// --- Цитираният труд и вече въведените му цитирания (изграденият сайт + въведените през формата в клона data)
const citables = JSON.parse(readFileSync('dist/publications/citables.json', 'utf8'));
// Членовете на колектива, чийто е цитираният труд (съавторите от колектива)
const owners = Object.keys(citables).filter((m) => (citables[m] ?? []).some((w) => w.key === data.cited));

// --- Право на достъп: акаунтът на някой от съавторите от колектива (чийто е трудът) или ръководителят
const member = team.find((m) => m.id === data.member);
const authorIds = team.filter((m) => m.github === author).map((m) => m.id);
result.authorized = !!member && owners.includes(data.member) && (author === ADMIN || authorIds.some((id) => owners.includes(id)));
if (!result.authorized) {
  result.errors.push(member
    ? `Заявката е от @${author}, а цитираният труд е на ${owners.join(', ') || data.member}. Цитиране потвърждава някой от съавторите от колектива със своя GitHub акаунт или ръководителят.`
    : `@${author} не е сред потребителите с право да въвеждат цитирания.`);
  done();
}
const work = (citables[data.member] ?? []).find((x) => x.key === data.cited) ?? null;
const FILE = `src/data/citations/${data.member}/contrib.json`;
const contrib = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : [];
const existing = [...(work?.cites ?? []), ...contrib.filter((c) => c.cited === data.cited && c.ghIssue !== issue).map((c) => ({ title: c.title, authors: c.authors, doi: c.doi ?? '' }))];
// цитиранията от същата заявка (повторна редакция) не са дубликат — сайтът вече ги показва, затова ги махаме от списъка
const own = contrib.filter((c) => c.ghIssue === issue).map((c) => c.text);
const list = existing.filter((x) => !own.includes(x.title));

const cctx = () => ({ cited: work ? { title: work.title, year: work.year, authors: work.authors } : null, existing: list });
const lang = /\bNew citation\b/.test(body) ? 'en/' : '';
const fixUrl = () => `${SITE}/${lang}publications/new/?m=${data.member}&cite=${encodeURIComponent(data.cited)}#d=${Buffer.from(JSON.stringify(data)).toString('base64url')}`;
const fail = (list) => {
  result.errors = list.map((e) => `**${fieldName[e.field] ?? e.field}:** ${M[e.code] ?? e.code}${e.detail ? ` ${e.detail}` : ''}`);
  result.howto = list.map((e) => `**${fieldName[e.field] ?? e.field}** — ${HOW[e.code] ?? 'поправете полето по подсказката във формата.'}`);
  result.fixUrl = fixUrl();
  result.title = String(data.title || data.doi || '').slice(0, 90);
  done();
};
// първа проверка (без данните от Crossref): цитиран труд, доказателство, показател
const pre = validateCitation(data, cctx());
if (pre.length) fail(pre);

// --- Доказателство: цитираният труд трябва да се намира в цитиращия
const ev = { how: '', url: '' };
const filled = new Set(); // полетата, попълнени автоматично от Crossref
const doi = cleanDoi(data.doi);
let crm = null; // данните от Crossref (ISSN / ISBN / вид) — за проверката на индексирането
try {
  if (data.src === 'doi') {
    const m = await crossrefWork(doi);
    crm = m;
    if (m) {
      const cr = fromCrossref(m);
      for (const [k, v] of Object.entries(cr)) if (!String(data[k] ?? '').trim()) { data[k] = v; filled.add(k); } // въведеното от члена има предимство
      const refs = m.reference ?? [];
      if (refs.length) {
        const f = findInRefs(refs, work, data.member);
        if (!f.found) fail([{ field: 'src', code: 'evnotfound', detail: `(литературата в Crossref: ${f.n} позиции)` }]);
        ev.how = `Crossref: в литературата на цитиращия труд, позиция ${f.pos} от ${f.n} (${f.how})`;
        if (!data.where) data.where = `[${f.pos}]`;
      } else ev.how = 'DOI в световна база (Crossref); списъкът с литература не е публикуван в Crossref';
    } else {
      if (!String(data.title || '').trim()) fail([{ field: 'doi', code: 'doimeta' }]);
      ev.how = 'DOI (не е в Crossref; проверен в doi.org / DataCite)';
    }
    ev.url = `https://doi.org/${doi}`;
  } else {
    const url = data.src === 'pdf' ? attachmentUrl(body) : String(data.url);
    if (!url) fail([{ field: 'src', code: 'evnopdf' }]);
    let got;
    try { got = await urlText(url); }
    catch (e) {
      if (data.src === 'pdf' && process.env.GH_TOKEN) { try { got = await urlText(url, { authorization: `Bearer ${process.env.GH_TOKEN}` }); } catch { /* по-долу */ } }
      if (!got) fail([{ field: data.src === 'pdf' ? 'src' : 'url', code: 'evunreach', detail: String(e.message || '') }]);
    }
    if (!got.text.trim()) fail([{ field: data.src === 'pdf' ? 'src' : 'url', code: 'evunreach', detail: got.pdf ? '(PDF без текстов слой — сканиран?)' : '' }]);
    if (!hasTitle(got.text, data.title)) fail([{ field: data.src === 'pdf' ? 'src' : 'url', code: 'evmismatch' }]);
    const f = findCited(got.text, work, data.member);
    if (!f) fail([{ field: 'src', code: 'evnotfound' }]);
    ev.how = `${data.src === 'pdf' ? 'PDF файл в заявката' : 'линк'}: ${f.how}`;
    ev.url = url;
  }
} catch (e) {
  if (e.code === 'unavailable') fail([{ field: data.src === 'doi' ? 'doi' : 'src', code: 'unavailable', detail: e.message }]);
  throw e;
}

// Б2: Д-13 / Д-14 без отметка за рецензиране — изданието в НРС на НАЦИД (по ISSN / ISBN) е рецензирано по определение
let peerBy = isYes(data.peer) ? 'потвърдено от потребителя' : '';
if (['13', '14'].includes(String(data.ind)) && !peerBy) {
  for (const n of [...new Set([data.idValue, ...(crm?.ISSN ?? []), ...(crm?.ISBN ?? [])].filter(Boolean))]) {
    try { const x = await nrsByNumber(n); if (x) { data.peer = true; peerBy = `НАЦИД НРС, ID ${x.id}: „${x.title}“`; break; } } catch { /* НРС не отговаря — остава отметката */ }
  }
}
let errs = validateCitation(data, { ...cctx(), full: true });
// Поле, попълнено автоматично от Crossref, не може да е причина за отказ: ако е в неподходящ формат
// (напр. номер на статия „ENEURO.0390-24.2025“ вместо страници), просто не се записва.
const bad = errs.filter((e) => ['fmt', 'issn', 'isbn'].includes(e.code) && (filled.has(e.field) || (e.field === 'idValue' && filled.has('idValue'))));
if (bad.length) {
  for (const e of bad) { if (e.field === 'idValue' || e.field === 'idType') { delete data.idType; delete data.idValue; } else delete data[e.field]; }
  errs = validateCitation(data, { ...cctx(), full: true });
}
if (errs.length) fail(errs);
result.title = String(data.title ?? '').slice(0, 90);

// --- Проверка на цитиращия труд в публичните регистри (DOI, ISSN, ISBN)
const entry = { ...normalizeCitation({ ...data, evidence: ev.how }), by: author, ghIssue: issue };
if (ev.url) entry.evidenceUrl = ev.url;
const v = await verifyEntry(entry);
if (v.errors.length) fail(v.errors);
if (v.nrsId) v.verified.push(`НАЦИД НРС, ID ${v.nrsId}: „${v.nrsTitle}“`);
entry.verified = [`Доказателство — ${ev.how}`, ...new Set(v.verified)];
if (peerBy) entry.verified.push(`Научно рецензиране — ${peerBy}`);
// Б2: индексирането по списъците (Scopus / WoS) — бележка към резултата; при разминаване с избрания показател — предупреждение
try {
  const lists = await loadIndexLists();
  if (lists.dbs.has('scopus')) {
    const issns = [...(crm?.ISSN ?? []), ...(data.idType?.includes('issn') ? [data.idValue] : []), ...(entry.issn ? [entry.issn] : [])];
    const isbns = [...(crm?.ISBN ?? []), ...(data.idType?.includes('isbn') ? [data.idValue] : []), ...(entry.isbn ? [entry.isbn] : [])];
    const kind = crm ? (crm.type === 'journal-article' ? 'journal' : 'book') : (String(data.idType ?? '').includes('issn') ? 'journal' : 'book');
    const r = classify(lists, { issns, isbns, year: Number(data.year), kind, venue: data.venue || (crm?.['container-title'] ?? [])[0] });
    const sgInd = r.suggest ? (r.suggest.startsWith('12') ? '12' : r.suggest) : '';
    entry.verified.push(`Индексиране по списъците: ${r.why}`);
    if (sgInd && sgInd !== String(entry.ind) && (sgInd === '12' || entry.ind === '12')) entry.verified.push(`⚠️ По списъците показателят е Д-${sgInd}, а е избран Д-${entry.ind} — проверете (поправка: „Върни“ и нова заявка)`);
  }
} catch { /* без списъци — без бележка */ }
result.verified = entry.verified;
const pts = { 12: 10, 13: 3, 14: 2 }[entry.ind];
result.apa = `${entry.text} — Д-${entry.ind}, ${pts} т.; цитиран труд: ${work.authors} (${work.year}). ${work.title}`;

// --- На кого се отчита: на всички съавтори от колектива на цитирания труд, без тези, за които е самоцитиране,
//     и без тези, при които същото цитиране вече е въведено. Достатъчно е потвърждение от един от тях.
const citingTeam = teamFromAuthors(parseAuthors(entry.authors).list);
const already = (m) => {
  const w = (citables[m] ?? []).find((x) => x.key === data.cited);
  const f = `src/data/citations/${m}/contrib.json`;
  const c = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')).filter((x) => x.cited === data.cited && x.ghIssue !== issue).map((x) => ({ title: x.title, authors: x.authors, doi: x.doi ?? '' })) : [];
  const list = [...(w?.cites ?? []), ...c];
  const tt = tnorm(entry.title);
  return !!findDuplicate(entry, list) || (tt.length >= 15 && list.some((x) => tnorm(x.title).includes(tt)));
};
const forMembers = owners.filter((m) => !citingTeam.includes(m) && (m === data.member || !already(m)));
result.members = forMembers;

// --- Запис във файла на всеки от тях (при повторна редакция на същата заявка — замяна)
for (const m of owners) {
  const f = `src/data/citations/${m}/contrib.json`;
  const old = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : [];
  const next = old.filter((c) => c.ghIssue !== issue);
  if (forMembers.includes(m)) next.push({ ...entry, member: m, ...(m !== data.member ? { confirmedBy: data.member } : {}) });
  if (next.length || existsSync(f)) { mkdirSync(`src/data/citations/${m}`, { recursive: true }); writeFileSync(f, JSON.stringify(next, null, 2) + '\n'); }
}
if (forMembers.length > 1) result.apa += ` · отчетено на: ${forMembers.join(', ')}`;

// --- Дневник (същият като за публикациите)
const LOG = 'publish-log.md';
const stamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Sofia' }).slice(0, 16);
const cell = (x) => String(x).replace(/\|/g, '/').replace(/\s+/g, ' ');
const head = '# Дневник на публикуванията от формата на сайта\n\nВсеки ред е публикуване или връщане. Връщане: отметката „Върни“ в коментара на заявката (само ръководителят).\n\n| Дата (София) | Заявка | Въведена от | Публикация | Проверено в | Действие |\n|---|---|---|---|---|---|\n';
const log = existsSync(LOG) ? readFileSync(LOG, 'utf8') : head;
writeFileSync(LOG, log + `| ${stamp} | #${issue} | @${author} | Цитиране на „${cell(work.title)}“: ${cell(entry.text)} (Д-${entry.ind}) | ${cell(entry.verified.join('; '))} | цитиране добавено |\n`);
result.ok = true;
done();
