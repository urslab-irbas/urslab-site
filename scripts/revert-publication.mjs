// Връщане (премахване от сайта) на публикация, въведена през формата — стартира се от .github/workflows/revert-publication.yml,
// когато ръководителят отметне „Върни“ в коментара на заявката. Премахва записа от src/data/contrib.json и пише в publish-log.md.
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
const issue = Number(process.env.ISSUE_NUMBER || 0);
const who = process.env.SENDER || '';
const contrib = JSON.parse(readFileSync('src/data/contrib.json', 'utf8'));
const gone = contrib.filter((c) => c.ghIssue === issue);
const ok = issue > 0 && gone.length > 0;
if (ok) {
  writeFileSync('src/data/contrib.json', JSON.stringify(contrib.filter((c) => c.ghIssue !== issue), null, 2) + '\n');
  const stamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Sofia' }).slice(0, 16);
  const cell = (x) => String(x).replace(/\|/g, '/').replace(/\s+/g, ' ');
  if (existsSync('publish-log.md')) appendFileSync('publish-log.md', `| ${stamp} | #${issue} | @${gone[0].by ?? ''} | ${cell(gone[0].title)} (${gone[0].year}) | — | върната от @${who} |\n`);
}
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `ok=${ok}\ntitle=${ok ? String(gone[0].title).slice(0, 90).replace(/\n/g, ' ') : ''}\n`);
console.log(ok ? `Премахната: ${gone[0].title}` : `Няма запис от заявка #${issue}`);
