// Б1 — измерване „преди / след“ (задача #121). Пуска се от .github/workflows/index-eval.yml (ръчно)
// или локално: node scripts/index-eval.mjs  (нужни: citation-scan/index/*, citation-scan/candidates.json от клона data).
//
// 1) Кандидатите от последното търсене (candidates.json): колко получават предложен показател и кой.
//    Преди Б1 ботът не предлага показател на нито един кандидат (потребителят избира сам).
// 2) Еталон — ръчно проверените цитирания (src/data/citations/<член>/index.ts) с ISSN в описанието:
//    дали предложението на Б1 съвпада с потвърдения показател (Д-12 / Д-13 / Д-14).
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { loadIndexLists, classify, listsSummary, normIssn } from './index-lists.mjs';

const CANDS = process.env.CANDS_FILE || 'citation-scan/candidates.json';
const lists = await loadIndexLists();
const out = [`## Б1 — проверка на индексирането: измерване (${new Date().toISOString().slice(0, 10)})`, '', listsSummary(lists), ''];
const ind = (o) => (o ? (o.startsWith('12') ? '12' : o) : '—');

// 1) Кандидати
if (existsSync(CANDS)) {
  const items = Object.values(JSON.parse(readFileSync(CANDS, 'utf8')).items ?? {}).filter((x) => x.status === 'ready');
  const cnt = { '12s': 0, '12w': 0, '13': 0, '14': 0, none: 0 }; const rows = [];
  for (const x of items) {
    const kind = x.options?.includes('14') ? 'journal' : x.options?.includes('13') ? 'book' : '';
    const issns = ['issn', 'eissn'].includes(x.data?.idType) ? [x.data.idValue] : [];
    const r = classify(lists, { issns, year: x.data?.year, kind });
    cnt[r.suggest ?? 'none']++;
    rows.push(`| ${String(x.data?.venue ?? '').slice(0, 60)} | ${x.data?.year ?? ''} | ${r.issns.join(' / ') || '—'} | ${r.suggest ? `Д-${ind(r.suggest)}${r.suggest === '12w' ? ' (WoS)' : ''}` : '—'} | ${r.why ?? ''}${r.other.length ? `; други бази: ${r.other.join(', ')}` : ''} |`);
  }
  out.push(`### 1. Кандидати за потвърждаване (${items.length})`, '',
    '| | Преди Б1 | След Б1 |', '|---|---|---|',
    `| С предложен показател | 0 | ${items.length - cnt.none} |`,
    `| — Д-12 (Scopus / WoS) | — | ${cnt['12s']} / ${cnt['12w']} |`, `| — Д-13 | — | ${cnt['13']} |`, `| — Д-14 | — | ${cnt['14']} |`,
    `| Без предложение (избира потребителят) | ${items.length} | ${cnt.none} |`, '',
    '<details><summary>По кандидати</summary>', '', '| Издание | Година | ISSN | Предложение | Основание |', '|---|---|---|---|---|', ...rows, '', '</details>', '');
} else out.push(`Няма ${CANDS} — частта за кандидатите е пропусната.`, '');

// 2) Еталон: ръчно проверените цитирания с ISSN в описанието
const truth = [];
for (const m of readdirSync('src/data/citations', { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const f = `src/data/citations/${m.name}/index.ts`;
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    const i = line.match(/ind: '(1[234])'/); if (!i) continue;
    const y = Number(line.match(/year: (\d{4})/)?.[1]);
    const issns = [...line.matchAll(/\b(\d{4}-\d{3}[\dXx])\b/g)].map((a) => a[1]).filter((s) => normIssn(s));
    if (!issns.length) continue;
    const kind = i[1] === '14' ? 'journal' : i[1] === '13' ? 'book' : (/ISBN|сборник|Proceedings|Conference|Lecture Notes|монография/i.test(line) ? 'book' : 'journal');
    truth.push({ member: m.name, ind: i[1], year: y, issns, kind, text: (line.match(/text: [`'"]([^`'"]{0,90})/)?.[1] ?? '') });
  }
}
let agree = 0, none = 0; const diff = [];
for (const t of truth) {
  const r = classify(lists, { issns: t.issns, year: t.year, kind: t.kind });
  if (!r.suggest) { none++; continue; }
  if (ind(r.suggest) === t.ind) agree++; else diff.push(`| ${t.member} | ${t.year} | ${t.issns.join(' / ')} | Д-${t.ind} | Д-${ind(r.suggest)} | ${r.why} | ${t.text}… |`);
}
out.push(`### 2. Еталон: ръчно проверени цитирания с ISSN (${truth.length})`, '',
  `Съвпада с потвърдения показател: **${agree}**; различава се: **${diff.length}**; без предложение: ${none}.`, '');
if (diff.length) out.push('| Член | Година | ISSN | Потвърдено | Предложено | Основание | Цитиращ труд |', '|---|---|---|---|---|---|---|', ...diff, '',
  'Разликите се преглеждат една по една: грешка в списъка/покритието, или в ръчно въведения показател.', '');

const md = out.join('\n');
writeFileSync('index-eval.md', md);
console.log(md);
