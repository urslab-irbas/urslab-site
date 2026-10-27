// ПРОБА (временна, маха се преди сливането): наблюдението на списанията без запис в клона data.
// Пуска се от .github/workflows/journal-watch-dryrun.yml в заявката за сливане; резултатът — probe/journal-watch.md.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { watchJournals } from './journal-watch.mjs';
const citables = JSON.parse(readFileSync('dist/publications/citables.json', 'utf8'));
const works = new Map();
for (const [m, list] of Object.entries(citables)) for (const w of list) { if (!works.has(w.key)) works.set(w.key, { ...w, owners: [] }); works.get(w.key).owners.push(m); }
const lines = [];
const st = {};
const stats = await watchJournals(works, st, { timeLimitMs: 25 * 60_000, since: process.env.JW_SINCE || '2026-09-01', log: (t) => lines.push(t) });
mkdirSync('probe', { recursive: true });
const hits = Object.values(st.hits).map((h) => `- **${h.cand.authors} (${h.cand.year}). ${h.cand.title}.** *${h.cand.venue}*. https://doi.org/${h.doi}\n  цитира: \`${h.cited}\` — ${h.how}; ${h.source}; ${h.url}`);
writeFileSync('probe/journal-watch.md', `# Проба: наблюдение на списанията на БАН (от ${process.env.JW_SINCE || '2026-09-01'})\n\n\`\`\`\n${JSON.stringify(stats, null, 1)}\n\`\`\`\n\n## Намерени цитирания (${hits.length})\n\n${hits.join('\n')}\n\n## Дневник\n\n${lines.join('\n')}\n`);
console.log(JSON.stringify(stats));
