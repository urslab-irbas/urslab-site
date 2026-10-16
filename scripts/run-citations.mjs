// Обработва всички чакащи заявки „[Цитиране] …“ една след друга (стартира се от .github/workflows/citation.yml).
// Вход: queue.json — [{ number, body, author }] (author: подателят; при заявки, отворени от бота след отметка
// в „[Нови цитирания]“ — човекът, който е отметнал, от маркера <!-- by:… -->).
// За всяка заявка — scripts/add-citation.mjs (всички проверки и запис в src/data/citations/*/contrib.json);
// резултатите — results.json. Сайтът се изгражда и качва веднъж за всички.
import { readFileSync, writeFileSync, appendFileSync, existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const queue = JSON.parse(readFileSync('queue.json', 'utf8'));
const results = [];
for (const q of queue) {
  if (existsSync('pub-result.json')) rmSync('pub-result.json');
  const r = spawnSync('node', ['scripts/add-citation.mjs'], {
    env: { ...process.env, ISSUE_BODY: q.body ?? '', ISSUE_AUTHOR: q.author, ISSUE_NUMBER: String(q.number) },
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  });
  process.stdout.write(`--- #${q.number} (@${q.author})\n${r.stdout ?? ''}${r.stderr ?? ''}\n`);
  const res = existsSync('pub-result.json')
    ? JSON.parse(readFileSync('pub-result.json', 'utf8'))
    : { ok: false, authorized: true, crashed: true, errors: [`Вътрешна грешка при проверката: ${String(r.stderr || '').split('\n').find((l) => /Error/.test(l)) ?? 'вижте лога'}`], howto: [], title: '' };
  const scan = String(q.body ?? '').match(/<!-- scan:(\d+):([0-9a-f]{8}) -->/);
  results.push({ number: q.number, author: q.author, scan: scan ? { issue: Number(scan[1]), id: scan[2] } : null, ...res });
}
writeFileSync('results.json', JSON.stringify(results, null, 2));
const ok = results.filter((r) => r.ok);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `any_ok=${ok.length > 0}\nnums=${ok.map((r) => '#' + r.number).join(', ')}\n`);
console.log(`Обработени: ${results.length}; приети: ${ok.length}`);
