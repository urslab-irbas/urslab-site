// Стартира се от .github/workflows/publication.yml при нова/редактирана заявка „[Публикация] …“.
// 1) Проверява, че заявката е от GitHub акаунт на член на колектива (src/data/team/*.ts → github).
// 2) Проверява записа със същите правила като формата на сайта (src/lib/pubSchema.js).
// 3) Проверява DOI / ISSN / ISBN в публичните регистри (scripts/verify-ids.mjs) — при неуспех записът се отказва.
// 4) При успех го добавя в src/data/contrib.json и в дневника publish-log.md (workflow-ът ги взима от клона data и ги записва обратно там). Резултатът е в pub-result.json.
// Локален тест: ISSUE_BODY="$(cat body.md)" ISSUE_AUTHOR=urslab-irbas ISSUE_NUMBER=1 node scripts/add-publication.mjs
import { readFileSync, writeFileSync, readdirSync, appendFileSync, existsSync } from 'node:fs';
import { validate, normalize, apa, MESSAGES, findDuplicate } from '../src/lib/pubSchema.js';
import { verifyEntry } from './verify-ids.mjs';

const SITE = process.env.SITE_URL || 'https://urs.ir.bas.bg';
const ADMIN = (process.env.ADMIN_LOGIN || 'urslab-irbas').toLowerCase();
const body = process.env.ISSUE_BODY || '';
const author = (process.env.ISSUE_AUTHOR || '').toLowerCase();
const issue = Number(process.env.ISSUE_NUMBER || 0);
const M = MESSAGES.bg;

const result = { ok: false, authorized: false, errors: [], howto: [], apa: '', fixUrl: `${SITE}/publications/new/`, title: '', verified: [] };
// Какво точно да направи авторът за всяка грешка (отива в коментара в заявката → GitHub го изпраща и по имейл)
const HOW = {
  required: 'попълнете полето.',
  fmt: 'поправете записа по примера под полето във формата.',
  range: 'проверете стойността (година, проценти, числа).',
  empty: 'въведете авторите.',
  format: 'запишете авторите в APA: „Фамилия, И.“, разделени със запетая, „&“ преди последния.',
  'no-team': 'сред авторите трябва да има член на колектива, записан с фамилия и инициал както в „Състав“.',
  short: 'въведете пълното заглавие, както е в изданието.',
  caps: 'напишете заглавието с нормални малки и главни букви.',
  unknown: 'изберете тема от списъка във формата.',
  duplicate: 'публикацията вече е на сайта (виж „Намерена“) — не я въвеждайте отново. Ако въвеждате друга публикация, поправете заглавието/DOI/авторите във формата и изпратете отново; за поправка на вече въведената пишете на ръководителя в тази заявка.',
  issn: 'въведете само номера на ISSN (8 знака, напр. 1314-8540), без Q, SJR и друг текст; проверете го в https://portal.issn.org',
  isbn: 'въведете само номера на ISBN (10 или 13 цифри), без друг текст.',
  idneeded: 'ако няма DOI, изберете вид идентификатор (ISSN, eISSN, ISBN или eISBN) и въведете номера.',
  notfound: 'проверете номера (сайт на издателя, https://portal.issn.org, https://nrs.nacid.bg). Ако изданието го няма в регистрите, пишете на ръководителя в тази заявка — той ще го въведе.',
  idmismatch: 'номерът е на изданието, посочено по-горе. Ако това е вашето издание, напишете в „Списание / сборник“ името му, както е в регистъра (може и с превода, напр. „Педагогика / Pedagogika“). Ако не е — въведете правилния ISSN/ISBN.',
  doititle: 'DOI е на публикацията с посоченото заглавие. Проверете DOI (отворете https://doi.org/…) и заглавието във формата.',
  unavailable: 'регистърът временно не отговаря — не е ваша грешка. Опитайте отново след около час със същата връзка.',
  notsub: 'за непубликувана статия изберете „Подадени / под печат“ (квартилът се посочва след излизане).',
  pubsub: 'за публикувана статия изберете реалната категория (Q1–Q4, SJR, ERIH+ …).',
  needed: 'за Q1–Q4 и „SJR без квартил“ попълнете SJR и/или IF.',
  'affil-needed': 'отворете връзката „Поправете“ и в полето „Институции на съавторите“ напишете институцията на всеки посочен съавтор — така, както е в самата публикация (напр. „ИР-БАН“, „ИМИ-БАН“). Ако не е ясно — попитайте съавтора или ръководителя.',
};
const done = () => {
  writeFileSync('pub-result.json', JSON.stringify(result, null, 2));
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `ok=${result.ok}\nauthorized=${result.authorized}\n`);
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
};

// --- Колектив: id и GitHub акаунт от src/data/team/*.ts
const team = readdirSync('src/data/team')
  .filter((f) => f.endsWith('.ts') && !['index.ts', 'types.ts'].includes(f))
  .map((f) => { const s = readFileSync(`src/data/team/${f}`, 'utf8'); return { id: s.match(/id:\s*'([^']+)'/)?.[1], github: s.match(/github:\s*'([^']+)'/)?.[1]?.toLowerCase() }; })
  .filter((m) => m.id && m.github);

// --- Данните от заявката (блокът ```json … ```)
const block = body.match(/```json\s*([\s\S]*?)```/);
let data;
try { data = JSON.parse(block?.[1] ?? ''); } catch { /* по-долу */ }
if (!data || typeof data !== 'object') {
  result.errors.push('Липсва или е повреден блокът с данни. Въведете публикацията отново през формата на сайта.');
  done();
}

// --- Право на достъп: собственият акаунт на члена или ръководителят
const member = team.find((m) => m.id === data.member);
result.authorized = !!member && (member.github === author || author === ADMIN);
if (!result.authorized) {
  result.errors.push(member
    ? `Заявката е от @${author}, а е подадена от името на ${data.member}. Влезте в GitHub със своя акаунт.`
    : `@${author} не е сред членовете на колектива с право да въвеждат публикации.`);
  done();
}

// --- Допустими категории и теми (от src/data/archive2022.ts)
const a22 = readFileSync('src/data/archive2022.ts', 'utf8');
const catKeys = [...(a22.match(/export type ArchCat =([^;]+);/)?.[1] ?? '').matchAll(/'([a-z0-9]+)'/g)].map((m) => m[1]);
const tagBlock = a22.match(/archiveTagLabels[^=]*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? '';
const tagKeys = [...tagBlock.matchAll(/^\s*([a-z0-9]+):/gm)].map((m) => m[1]);

// --- Вече въведени публикации (DOI и заглавия от всички файлове с данни)
const existing = [];
for (const f of readdirSync('src/data').filter((f) => /\.(ts|json)$/.test(f) && f !== 'contrib.json')) {
  const s = readFileSync(`src/data/${f}`, 'utf8');
  for (const m of s.matchAll(/title:\s*(['"`])((?:\\.|(?!\1).)*)\1/g)) existing.push({ title: m[2].replace(/\\(.)/g, '$1'), doi: '' });
  for (const m of s.matchAll(/doi:\s*'([^']+)'/g)) existing.push({ title: '', doi: m[1] });
}
const contrib = JSON.parse(readFileSync('src/data/contrib.json', 'utf8'));
for (const c of contrib) if (c.ghIssue !== issue) existing.push({ title: c.title, authors: c.authors, doi: c.doi ?? '', year: c.year, where: c.cat === 'sub' ? 'publications' : `publications/${c.year <= 2021 ? 'earlier' : c.year <= 2024 ? '2022-2024' : c.year}` });
// Пълният списък от сайта (с автори) — ако сайтът не отговаря, остават заглавията и DOI от файловете по-горе
try {
  const r = await fetch(`${SITE}/publications/all.json`, { signal: AbortSignal.timeout(20000) });
  if (r.ok) { const all = await r.json(); if (Array.isArray(all) && all.length) { existing.length = 0; existing.push(...all, ...contrib.filter((c) => c.ghIssue !== issue).map((c) => ({ title: c.title, authors: c.authors, doi: c.doi ?? '', year: c.year, where: c.cat === 'sub' ? 'publications' : `publications/${c.year <= 2021 ? 'earlier' : c.year <= 2024 ? '2022-2024' : c.year}` }))); } }
} catch { /* сайтът не отговаря — ползваме списъка от файловете */ }

// --- Проверка
const errs = validate(data, { catKeys, tagKeys, existing });
const fieldName = { affil: 'Институции на съавторите', authors: 'Автори', year: 'Година', title: 'Заглавие', status: 'Състояние', cat: 'Категория', idType: 'Вид идентификатор', idValue: 'ISSN / ISBN', venue: 'Списание / сборник', volume: 'Том', pages: 'Страници', publisher: 'Издател', doi: 'DOI', isbn: 'ISBN', url: 'Линк', sjr: 'SJR', jif: 'IF', share: 'Дял ИР', tags: 'Теми' };
const dupOf = findDuplicate(data, existing);
const dupText = dupOf ? ` Причина: ${dupOf.by === 'doi' ? 'същото DOI' : dupOf.by === 'title+authors' ? 'същото заглавие и общ автор' : 'същото заглавие'}. Намерена: ${dupOf.item.authors ?? ''}${dupOf.item.year ? ` (${dupOf.item.year})` : ''}. „${dupOf.item.title}“${dupOf.item.where ? ` — ${SITE}/${dupOf.item.where}/` : ''}` : '';
result.errors = errs.map((e) => `**${fieldName[e.field] ?? e.field}:** ${M[e.code] ?? e.code}${e.detail ? ` ${e.detail}` : ''}${e.code === 'duplicate' ? dupText : ''}`);
result.howto = errs.map((e) => `**${fieldName[e.field] ?? e.field}** — ${HOW[e.code] ?? 'поправете полето по подсказката във формата.'}`);
result.fixUrl = `${SITE}/publications/new/?m=${data.member}#d=${Buffer.from(JSON.stringify(data)).toString('base64url')}`;
result.title = String(data.title ?? '').slice(0, 90);
if (errs.length) done();

// --- Проверка в публичните регистри (DOI, ISSN, ISBN; НАЦИД НРС ID)
const entry = { ...normalize(data), by: author, ghIssue: issue };
const v = await verifyEntry(entry);
if (v.errors.length) {
  result.errors = v.errors.map((e) => `**${fieldName[e.field] ?? e.field}:** ${M[e.code] ?? e.code}${e.detail ? ` ${e.detail}` : ''}`);
  result.howto = v.errors.map((e) => `**${fieldName[e.field] ?? e.field}** — ${HOW[e.code] ?? 'поправете полето по подсказката във формата.'}`);
  done();
}
if (v.nrsId) { entry.nrsId = v.nrsId; v.verified.push(`НАЦИД НРС, ID ${v.nrsId}: „${v.nrsTitle}“`); }
entry.verified = [...new Set(v.verified)];
result.verified = entry.verified;
result.apa = apa(entry);

// --- Запис (при повторна редакция на същата заявка — замяна)
const next = contrib.filter((c) => c.ghIssue !== issue).concat(entry);
writeFileSync('src/data/contrib.json', JSON.stringify(next, null, 2) + '\n');

// --- Дневник на публикуванията (всяко публикуване и връщане)
const LOG = 'publish-log.md';
const stamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Sofia' }).slice(0, 16);
const cell = (x) => String(x).replace(/\|/g, '/').replace(/\s+/g, ' ');
const head = '# Дневник на публикуванията от формата на сайта\n\nВсеки ред е публикуване или връщане. Връщане: отметката „Върни“ в коментара на заявката (само ръководителят).\n\n| Дата (София) | Заявка | Въведена от | Публикация | Проверено в | Действие |\n|---|---|---|---|---|---|\n';
const log = existsSync(LOG) ? readFileSync(LOG, 'utf8') : head;
writeFileSync(LOG, log + `| ${stamp} | #${issue} | @${author} | ${cell(entry.title)} (${entry.year}) | ${cell(entry.verified.join('; '))} | публикувана |\n`);
result.ok = true;
done();
