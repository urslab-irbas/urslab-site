// Стартира се от .github/workflows/citation.yml при нова/редактирана заявка „[Цитиране] …“ (формата на сайта в режим „Ново цитиране“).
// 1) Проверява, че заявката е от GitHub акаунта на члена на колектива, чийто е цитираният труд (или от ръководителя).
// 2) Намира цитирания труд сред публикуваните трудове на члена (dist/publications/citables.json — сайтът е изграден преди това).
// 3) Проверява цитирането с правилата за нова публикация + правилата на НАЦИД (src/lib/pubSchema.js → validateCitation):
//    без самоцитиране, година, показател (Д-12 — Scopus/WoS, Д-14 — ISSN), доказателство „къде“, без повторно въвеждане.
// 4) Проверява DOI / ISSN / ISBN на цитиращия труд в публичните регистри (scripts/verify-ids.mjs).
// 5) При успех го добавя в src/data/citations/<член>/contrib.json и в дневника publish-log.md (клон data). Резултатът е в pub-result.json.
// Локален тест: ISSUE_BODY="$(cat body.md)" ISSUE_AUTHOR=urslab-irbas ISSUE_NUMBER=1 node scripts/add-citation.mjs
import { readFileSync, writeFileSync, readdirSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { validateCitation, normalizeCitation, MESSAGES } from '../src/lib/pubSchema.js';
import { verifyEntry } from './verify-ids.mjs';

const SITE = process.env.SITE_URL || 'https://urs.ir.bas.bg';
const ADMIN = (process.env.ADMIN_LOGIN || 'urslab-irbas').toLowerCase();
const body = process.env.ISSUE_BODY || '';
const author = (process.env.ISSUE_AUTHOR || '').toLowerCase();
const issue = Number(process.env.ISSUE_NUMBER || 0);
const M = MESSAGES.bg;

const result = { ok: false, authorized: false, errors: [], howto: [], apa: '', fixUrl: `${SITE}/team/`, title: '', verified: [], member: '', cited: '' };
const HOW = {
  required: 'попълнете полето.',
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
  citednf: 'отворете „Обобщен отчет“, натиснете бутона „Цитирания“ под годината на труда и после „+ Цитиране“.',
  issn: 'въведете само номера на ISSN (8 знака, напр. 1314-8540); проверете го в https://portal.issn.org',
  isbn: 'въведете само номера на ISBN (10 или 13 цифри), без друг текст.',
  idneeded: 'ако няма DOI, изберете вид идентификатор (ISSN, eISSN, ISBN или eISBN) и въведете номера.',
  notfound: 'проверете номера (сайт на издателя, https://portal.issn.org, https://nrs.nacid.bg). Ако изданието го няма в регистрите, пишете на ръководителя в тази заявка.',
  idmismatch: 'номерът е на изданието, посочено по-горе. Ако това е вашето издание, напишете в „Списание / сборник“ името му, както е в регистъра; ако не е — въведете правилния ISSN/ISBN.',
  doititle: 'DOI е на публикацията с посоченото заглавие. Проверете DOI (отворете https://doi.org/…) и заглавието във формата.',
  unavailable: 'регистърът временно не отговаря — не е ваша грешка. Опитайте отново след около час със същата връзка.',
};
const fieldName = { cited: 'Цитиран труд', authors: 'Автори', year: 'Година', title: 'Заглавие', venue: 'Списание / сборник', volume: 'Том', pages: 'Страници', publisher: 'Издател', doi: 'DOI', idType: 'Вид идентификатор', idValue: 'ISSN / ISBN', url: 'Линк', ind: 'Показател', index: 'Индексиран в', where: 'Къде е цитирането' };
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

// --- Право на достъп: собственият акаунт на члена (чийто е трудът) или ръководителят
const member = team.find((m) => m.id === data.member);
result.authorized = !!member && (member.github === author || author === ADMIN);
if (!result.authorized) {
  result.errors.push(member
    ? `Заявката е от @${author}, а цитирането е за труд на ${data.member}. Цитирания на свой труд въвежда само авторът (със своя GitHub акаунт) или ръководителят.`
    : `@${author} не е сред членовете на колектива с право да въвеждат цитирания.`);
  done();
}

// --- Цитираният труд и вече въведените му цитирания (изграденият сайт + въведените през формата в клона data)
const citables = JSON.parse(readFileSync('dist/publications/citables.json', 'utf8'));
const work = (citables[data.member] ?? []).find((x) => x.key === data.cited) ?? null;
const FILE = `src/data/citations/${data.member}/contrib.json`;
const contrib = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : [];
const existing = [...(work?.cites ?? []), ...contrib.filter((c) => c.cited === data.cited && c.ghIssue !== issue).map((c) => ({ title: c.title, authors: c.authors, doi: c.doi ?? '' }))];
// цитиранията от същата заявка (повторна редакция) не са дубликат — сайтът вече ги показва, затова ги махаме от списъка
const own = contrib.filter((c) => c.ghIssue === issue).map((c) => c.text);
const list = existing.filter((x) => !own.includes(x.title));

const errs = validateCitation(data, { cited: work ? { title: work.title, year: work.year, authors: work.authors } : null, existing: list });
result.errors = errs.map((e) => `**${fieldName[e.field] ?? e.field}:** ${M[e.code] ?? e.code}${e.detail ? ` ${e.detail}` : ''}`);
result.howto = errs.map((e) => `**${fieldName[e.field] ?? e.field}** — ${HOW[e.code] ?? 'поправете полето по подсказката във формата.'}`);
const lang = /\bNew citation\b/.test(body) ? 'en/' : '';
result.fixUrl = `${SITE}/${lang}publications/new/?m=${data.member}&cite=${encodeURIComponent(data.cited)}#d=${Buffer.from(JSON.stringify(data)).toString('base64url')}`;
result.title = String(data.title ?? '').slice(0, 90);
if (errs.length) done();

// --- Проверка на цитиращия труд в публичните регистри (DOI, ISSN, ISBN)
const entry = { ...normalizeCitation(data), by: author, ghIssue: issue };
const v = await verifyEntry(entry);
if (v.errors.length) {
  result.errors = v.errors.map((e) => `**${fieldName[e.field] ?? e.field}:** ${M[e.code] ?? e.code}${e.detail ? ` ${e.detail}` : ''}`);
  result.howto = v.errors.map((e) => `**${fieldName[e.field] ?? e.field}** — ${HOW[e.code] ?? 'поправете полето по подсказката във формата.'}`);
  done();
}
if (v.nrsId) v.verified.push(`НАЦИД НРС, ID ${v.nrsId}: „${v.nrsTitle}“`);
entry.verified = [...new Set(v.verified)];
result.verified = entry.verified;
const pts = { 12: 10, 13: 3, 14: 2 }[entry.ind];
result.apa = `${entry.text} — Д-${entry.ind}, ${pts} т.; цитиран труд: ${work.authors} (${work.year}). ${work.title}`;

// --- Запис (при повторна редакция на същата заявка — замяна)
mkdirSync(`src/data/citations/${data.member}`, { recursive: true });
writeFileSync(FILE, JSON.stringify(contrib.filter((c) => c.ghIssue !== issue).concat(entry), null, 2) + '\n');

// --- Дневник (същият като за публикациите)
const LOG = 'publish-log.md';
const stamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Sofia' }).slice(0, 16);
const cell = (x) => String(x).replace(/\|/g, '/').replace(/\s+/g, ' ');
const head = '# Дневник на публикуванията от формата на сайта\n\nВсеки ред е публикуване или връщане. Връщане: отметката „Върни“ в коментара на заявката (само ръководителят).\n\n| Дата (София) | Заявка | Въведена от | Публикация | Проверено в | Действие |\n|---|---|---|---|---|---|\n';
const log = existsSync(LOG) ? readFileSync(LOG, 'utf8') : head;
writeFileSync(LOG, log + `| ${stamp} | #${issue} | @${author} | Цитиране на „${cell(work.title)}“: ${cell(entry.text)} (Д-${entry.ind}) | ${cell(entry.verified.join('; '))} | цитиране добавено |\n`);
result.ok = true;
done();
