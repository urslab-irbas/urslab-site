// Потвърждаване / отказ с отметка в заявката „[Нови цитирания] …“ (стартира се от .github/workflows/citation-confirm.yml).
// Под всяко проверено цитиране има отметки: показател (Д-12 Scopus / Д-12 WoS / Д-13 / Д-14) или „Откажи“
// (scripts/scan-citations.mjs; данните — citation-scan/candidates.json в клона data).
// Тук: намират се отметнатите, но още необработени кандидати; проверява се правото на човека, който е отметнал
// (GitHub акаунтът на съавтор от колектива на цитирания труд или ръководителят), и се съставя план:
//   - потвърдено → нова заявка „[Цитиране] …“ с готовите данни (обработва се от citation.yml като въведена от формата:
//     всички проверки, запис на всички съавтори, „Върни“), на мястото на отметките — ред „⏳ потвърдено … → #N“;
//   - отказано → state.rejected (не се предлага повече), ред „❌ отказано от …“;
//   - без право / две различни отметки → отметките се махат и се пише защо.
// Локален тест: node scripts/confirm-citations.mjs body.md urslab-irbas 97  → plan.json
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { normalizeCitation, CIT_POINTS } from '../src/lib/pubSchema.js';

export const MARK = /^(\s*[-*]\s+\[)([ xX])(\]\s.*?<!--c:([0-9a-f]{8}):(\w+)-->)[ \t]*$/gm;
export const OPT_LABEL = { '12s': 'Д-12 · Scopus', '12w': 'Д-12 · Web of Science', 13: 'Д-13', 14: 'Д-14' };
const IND = { '12s': ['12', 'scopus'], '12w': ['12', 'wos'], 13: ['13'], 14: ['14'] };

/** Отметнатите (необработени) кандидати: { id → [опции] } */
export function ticked(body) {
  const out = {};
  for (const m of String(body).matchAll(MARK)) if (m[2] !== ' ') (out[m[4]] ??= []).push(m[5]);
  return out;
}
/** Заменя отметките на кандидата с ред за състоянието (маркер <!--s:id--> за следващо обновяване) */
export function setStatus(body, id, text) {
  const lines = String(body).split('\n');
  const line = `  - ${text} <!--s:${id}-->`;
  const i = lines.findIndex((l) => l.includes(`<!--s:${id}-->`) || l.includes(`<!--c:${id}:`));
  if (i < 0) return body;
  const rest = lines.filter((l, j) => j <= i || !(l.includes(`<!--c:${id}:`) || l.includes(`<!--s:${id}-->`)));
  rest[i] = line;
  return rest.join('\n');
}
/** Маха отметките на кандидата (без право / неясен избор) */
export function untick(body, id) {
  return String(body).replace(MARK, (all, a, x, b, cid) => (cid === id ? `${a} ${b}` : all));
}

export function plan({ body, sender, issue, items, team, admin, date = new Date().toISOString().slice(0, 10) }) {
  const who = String(sender).toLowerCase();
  const isAdmin = who === String(admin).toLowerCase();
  const mine = team.filter((m) => m.github && m.github.toLowerCase() === who).map((m) => m.id);
  const name = (id) => team.find((m) => m.id === id)?.name ?? id;
  const res = { confirm: [], reject: [], deny: [], unknown: [] };
  for (const [id, opts] of Object.entries(ticked(body))) {
    const c = items[id];
    if (!c) { res.unknown.push({ id }); continue; }
    if (!isAdmin && !mine.some((m) => c.owners.includes(m))) { res.deny.push({ id, why: `@${sender} не е съавтор на „${c.work}“ — отметка слагат съавторите от колектива с акаунт или ръководителят` }); continue; }
    const set = [...new Set(opts)];
    if (set.length > 1) { res.deny.push({ id, why: `отметнати са няколко възможности (${set.map((o) => OPT_LABEL[o] ?? 'Откажи').join(', ')}) — отметнете само една` }); continue; }
    const o = set[0];
    if (o === 'x') { res.reject.push({ id, key: c.key, status: `❌ отказано от @${sender} (${date}) — няма да се предлага повече` }); continue; }
    if (!IND[o] || !(c.options ?? []).includes(o)) { res.deny.push({ id, why: 'тази възможност не е предвидена за цитирането — използвайте формата' }); continue; }
    const [ind, index] = IND[o];
    // отчита се от името на подателя, ако не е самоцитиране за него; иначе — от първия съавтор, за когото не е
    const member = mine.find((m) => c.eligible.includes(m)) ?? c.eligible[0];
    const data = { ...c.data, member, ind, ...(index ? { index } : {}), ...(['13', '14'].includes(ind) ? { peer: true } : {}) };
    if (!index) delete data.index;
    const text = normalizeCitation(data).text;
    const issueBody = [
      `Ново цитиране, потвърдено с отметка в #${issue} от **${name(mine[0] ?? member)}** (@${sender}).`,
      '', `**Цитиран труд:** ${c.work}`,
      `**Цитиращ източник (НАЦИД):** ${text} — Д-${ind}${index ? ` (${index === 'wos' ? 'Web of Science' : 'Scopus'})` : ''}, ${CIT_POINTS[ind]} т.`,
      `**Предварителна проверка:** ${c.evidence || '—'}`, '',
      `<!-- by:${sender} -->`, `<!-- scan:${issue}:${id} -->`,
      '<!-- Не променяйте блока по-долу. За поправка използвайте формата на сайта. -->',
      '```json', JSON.stringify(data, null, 2), '```',
    ].join('\n');
    res.confirm.push({ id, key: c.key, title: `[Цитиране] ${String(data.title).slice(0, 90)}`, body: issueBody, status: `⏳ потвърдено от @${sender} като ${OPT_LABEL[o]} (${CIT_POINTS[ind]} т.) — проверява се: #NEW` });
  }
  return res;
}

// --- CLI (от workflow): node scripts/confirm-citations.mjs <body-file> <sender> <issue>
if (import.meta.url === `file://${process.argv[1]}`) {
  const [bodyFile, sender, issue] = process.argv.slice(2);
  const team = readdirSync('src/data/team')
    .filter((f) => f.endsWith('.ts') && !['index.ts', 'types.ts'].includes(f))
    .map((f) => { const s = readFileSync(`src/data/team/${f}`, 'utf8'); return { id: s.match(/id:\s*'([^']+)'/)?.[1], github: s.match(/github:\s*'([^']+)'/)?.[1], name: s.match(/name:\s*\{\s*bg:\s*'([^']+)'/)?.[1] }; })
    .filter((m) => m.id);
  const F = process.env.CANDS_FILE || 'citation-scan/candidates.json';
  const items = existsSync(F) ? JSON.parse(readFileSync(F, 'utf8')).items ?? {} : {};
  const p = plan({ body: readFileSync(bodyFile, 'utf8'), sender, issue: Number(issue), items, team, admin: process.env.ADMIN_LOGIN || 'urslab-irbas' });
  writeFileSync('plan.json', JSON.stringify(p, null, 2));
  console.log(JSON.stringify({ confirm: p.confirm.map((x) => x.id), reject: p.reject.map((x) => x.id), deny: p.deny, unknown: p.unknown }, null, 2));
}
