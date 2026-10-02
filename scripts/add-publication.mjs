// Стартира се от .github/workflows/publication.yml при нова/редактирана заявка „[Публикация] …“.
// 1) Проверява, че заявката е от GitHub акаунт на член на колектива (src/data/team/*.ts → github).
// 2) Проверява записа със същите правила като формата на сайта (src/lib/pubSchema.js).
// 3) При успех го добавя в src/data/contrib.json. Резултатът е в pub-result.json за следващите стъпки.
// Локален тест: ISSUE_BODY="$(cat body.md)" ISSUE_AUTHOR=urslab-irbas ISSUE_NUMBER=1 node scripts/add-publication.mjs
import { readFileSync, writeFileSync, readdirSync, appendFileSync } from 'node:fs';
import { validate, normalize, apa, MESSAGES } from '../src/lib/pubSchema.js';

const SITE = process.env.SITE_URL || 'https://urs.ir.bas.bg';
const ADMIN = (process.env.ADMIN_LOGIN || 'urslab-irbas').toLowerCase();
const body = process.env.ISSUE_BODY || '';
const author = (process.env.ISSUE_AUTHOR || '').toLowerCase();
const issue = Number(process.env.ISSUE_NUMBER || 0);
const M = MESSAGES.bg;

const result = { ok: false, authorized: false, errors: [], apa: '', fixUrl: `${SITE}/publications/new/`, title: '' };
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
for (const c of contrib) if (c.ghIssue !== issue) existing.push({ title: c.title, doi: c.doi ?? '' });

// --- Проверка
const errs = validate(data, { catKeys, tagKeys, existing });
const fieldName = { authors: 'Автори', year: 'Година', title: 'Заглавие', cat: 'Категория', venue: 'Списание / сборник', volume: 'Том', pages: 'Страници', publisher: 'Издател', doi: 'DOI', isbn: 'ISBN', url: 'Линк', sjr: 'SJR', jif: 'IF', share: 'Дял ИР', tags: 'Теми' };
result.errors = errs.map((e) => `**${fieldName[e.field] ?? e.field}:** ${M[e.code] ?? e.code}`);
result.fixUrl = `${SITE}/publications/new/?m=${data.member}#d=${Buffer.from(JSON.stringify(data)).toString('base64url')}`;
result.title = String(data.title ?? '').slice(0, 90);
if (errs.length) done();

// --- Запис (при повторна редакция на същата заявка — замяна)
const entry = { ...normalize(data), by: author, ghIssue: issue };
result.apa = apa(entry);
const next = contrib.filter((c) => c.ghIssue !== issue).concat(entry);
writeFileSync('src/data/contrib.json', JSON.stringify(next, null, 2) + '\n');
result.ok = true;
done();
