// Връщане (премахване от сайта) на цитиране, въведено през формата — стартира се от .github/workflows/revert-citation.yml,
// когато ръководителят отметне „Върни“ в коментара на заявката „[Цитиране] …“.
// Премахва записа от src/data/citations/<член>/contrib.json на всички съавтори, на които е отчетено, и пише в publish-log.md.
import { readFileSync, writeFileSync, existsSync, appendFileSync, readdirSync } from 'node:fs';
const issue = Number(process.env.ISSUE_NUMBER || 0);
const who = process.env.SENDER || '';
let gone = null; const files = [];
for (const d of existsSync('src/data/citations') ? readdirSync('src/data/citations') : []) {
  const f = `src/data/citations/${d}/contrib.json`;
  if (!existsSync(f) || issue <= 0) continue;
  const list = JSON.parse(readFileSync(f, 'utf8'));
  const hit = list.find((c) => c.ghIssue === issue);
  if (hit) { gone ??= hit; files.push(f); writeFileSync(f, JSON.stringify(list.filter((c) => c.ghIssue !== issue), null, 2) + '\n'); }
}
const ok = !!gone;
if (ok) {
  const stamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Sofia' }).slice(0, 16);
  const cell = (x) => String(x).replace(/\|/g, '/').replace(/\s+/g, ' ');
  if (existsSync('publish-log.md')) appendFileSync('publish-log.md', `| ${stamp} | #${issue} | @${gone.by ?? ''} | Цитиране: ${cell(gone.text)} (${files.length} съавт.) | — | върнато от @${who} |\n`);
}
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `ok=${ok}\ntitle=${ok ? String(gone.title).slice(0, 90).replace(/\n/g, ' ') : ''}\n`);
console.log(ok ? `Премахнато от ${files.length} файла: ${gone.text}` : `Няма цитиране от заявка #${issue}`);
