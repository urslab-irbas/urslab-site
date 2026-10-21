// Б4 (задача #121): „Точки НАЦИД“ и стратегия за всеки член на колектива.
//
// Модел (статия ICAICTSEE 2026, раздел 6): P(g) = Σ p(cⱼ)·w(nⱼ) по публикациите в група g (Област 5, ППЗРАСРБ и
// Правилника на БАН, Таблица 2; w = 1/n при n автори), изискване P(g) ≥ M(g, d) за целевата длъжност d (Таблица 1).
// Недостиг d(g) = max(0, M − P); стратегията показва с какво се покрива той по точките от Таблица 2.
//
// Членът с проверена справка (src/data/nacid.ts) — групите от нея (Д се смята от цитиранията).
// Останалите — автоматично от публикациите им на сайта:
//   В (показател 4, ≥ 10 публикации в Scopus/WoS, 60/n всяка) ↔ Г (показател 7, 40/n) — една публикация е само в едната
//   група; разпределението се избира оптимално (динамично програмиране): В се покрива с най-малка загуба за Г;
//   монография → показател 5 (30) или В3 (100) — каквото дава по-малък общ недостиг;
//   нереферирани → показател 8 (20/n); учебници → Е23 (40/n); „доктор на науките“ → Е16 (40); Д — от цитиранията.
// НЕ се знае автоматично (отбелязва се в писмото): трудовете от предишни процедури (не се ползват повторно), проекти,
// ръководство на докторанти, патенти и др. от група Е — те се добавят като проверена справка в nacid.ts.
// Писмото с таблицата се праща само на члена и на ръководителя (scripts/nacid-mail.ts, .github/workflows/nacid-table.yml).
import type { ArchivePub } from './archive2022';
import { allPubs } from './allPubs';
import { team, type Member } from './team';
import { nacidRecords, groupPts } from './nacid';
import { citationsFor, hiddenCitationsFor } from './citations';
import { expectedFor } from './series';
import { parseAuthors } from '../lib/pubSchema.js';

export const COLS = ['Доктор', 'Доктор на науките', 'Главен асистент', 'Доцент', 'Професор'];
const REF = nacidRecords.madzharov.groups; // изискванията (Таблица 1, Област 5) — едни и същи за всички
export const REQ: Record<string, (number | null)[]> = Object.fromEntries(REF.map((g) => [g.key, g.req]));
export const LABEL: Record<string, string> = Object.fromEntries(REF.map((g) => [g.key, g.label.bg]));
const INDEXED = ['q1', 'q2', 'q3', 'q4', 'sjr', 'idx'];
const r2 = (x: number) => Math.round(x * 100) / 100;

/** Целева длъжност: следващата след сегашната (по академичната титла в профила) */
export function targetOf(m: Member): number | null {
  const t = m.title.bg;
  if (/проф/.test(t)) return null;
  if (/доц/.test(t)) return 4;
  if (/гл\.\s*ас/.test(t)) return 3;
  if (/ас\./.test(t)) return 2;
  return 0;
}
const nAuthors = (p: ArchivePub) => { const l = parseAuthors(p.authors).list.length; return l || String(p.authors).split(/,|&| and /).filter((s) => s.trim()).length || 1; };

export interface Line { text: string; pts: number }
export interface GroupRes { key: string; label: string; req: number | null; pts: number; deficit: number; lines: Line[]; cond?: string }
export interface Strategy {
  member: Member; target: number | null; manual: boolean; groups: GroupRes[];
  steps: string[]; notes: string[]; expected: string[]; pending: { n: number; pts: number } | null;
}

/**
 * Минимална по стойност подсъвкупност от индексираните публикации за група В (показател 4): поне 10 броя и
 * Σ 60/n ≥ 100 т., с най-малък сбор — така група Г губи най-малко (40/n = ⅔ от 60/n). Динамично програмиране
 * по брой (0…10, „10“ = 10 и повече) и сбор в стотни точки (до 200 т.); пътят се възстановява по родителите.
 */
export function chooseV(vals: number[]): number[] | null {
  const N = vals.length, K = 10, CAP = 20000, NEED = 10000;
  if (N < K) return null;
  const c = vals.map((x) => Math.round(x * 100));
  const W = (K + 1) * (CAP + 1);
  const reach: Uint8Array[] = [new Uint8Array(W)];
  reach[0][0] = 1;
  for (let i = 0; i < N; i++) {
    const prev = reach[i], cur = prev.slice();
    for (let k = 0; k <= K; k++) for (let s0 = 0; s0 <= CAP; s0++) {
      if (!prev[k * (CAP + 1) + s0]) continue;
      const k2 = Math.min(K, k + 1), s2 = Math.min(CAP, s0 + c[i]);
      cur[k2 * (CAP + 1) + s2] = 1;
    }
    reach.push(cur);
  }
  let best = -1;
  for (let s0 = NEED; s0 <= CAP; s0++) if (reach[N][K * (CAP + 1) + s0]) { best = s0; break; }
  if (best < 0) return null;
  // обратно: за всеки елемент — дали е взет (състояние, достижимо без него, се предпочита)
  const pick: number[] = []; let k = K, s0 = best;
  for (let i = N - 1; i >= 0; i--) {
    if (reach[i][k * (CAP + 1) + s0]) continue; // достижимо и без елемент i
    // елемент i е взет: намираме предходното състояние
    let found = false;
    for (let kp = k === K ? K : k - 1; kp >= Math.max(0, k - 1) && !found; kp--) {
      if (Math.min(K, kp + 1) !== k) continue;
      for (const sp of s0 === CAP ? Array.from({ length: CAP + 1 }, (_, t) => CAP - t) : [s0 - c[i]]) {
        if (sp < 0 || Math.min(CAP, sp + c[i]) !== s0) continue;
        if (reach[i][kp * (CAP + 1) + sp]) { pick.push(i); k = kp; s0 = sp; found = true; break; }
      }
    }
    if (!found) return null;
  }
  return pick.reverse();
}

export function strategyFor(id: string): Strategy {
  const m = team.find((x) => x.id === id)!;
  const target = targetOf(m);
  const mine = allPubs.filter((p) => p.team.includes(id));
  const pub = mine.filter((p) => p.cat !== 'sub');
  const sub = mine.filter((p) => p.cat === 'sub');
  // Д — от проверените цитирания (ръчно, през формата и с отметка)
  const cit = citationsFor(id, pub);
  const dLines: Line[] = []; let dPts = 0, nCit = 0;
  for (const [p, b] of cit) { dPts += b.pts; nCit += b.work.cites.length; if (b.pts) dLines.push({ text: `${p.title.slice(0, 90)} — ${b.work.cites.length} цит.`, pts: r2(b.pts) }); }
  for (const b of hiddenCitationsFor(id)) { dPts += b.pts; nCit += b.work.cites.length; dLines.push({ text: `${b.work.hidden!.text.slice(0, 90)} — ${b.work.cites.length} цит.`, pts: r2(b.pts) }); }
  const notes: string[] = []; const steps: string[] = []; const expected: string[] = [];
  const rec = nacidRecords[id];
  let groups: GroupRes[];
  const col = target ?? 4;

  if (rec) {
    groups = rec.groups.map((g) => {
      const pts = g.key === 'Д' ? r2(dPts) : groupPts(g);
      const lines = g.key === 'Д' ? dLines : (g.items ?? []).map((x) => ({ text: `${x.no ? `№ ${x.no}. ` : ''}${x.text}`, pts: r2(x.pts) }));
      const req = g.req[col] ?? null;
      const cond = g.key === 'В' && /не по-малко от 10|поне 10/.test(g.note?.bg ?? '') ? g.note?.bg : undefined;
      return { key: g.key, label: g.label.bg, req, pts, deficit: req ? r2(Math.max(0, req - pts)) : 0, lines, cond };
    });
    notes.push(`Групите А, В, Г и Е са по проверената справка (${rec.date}); група Д се изчислява от цитиранията в Системата (${nCit} цитирания).`);
    for (const n of rec.notes ?? []) notes.push(n.bg);
  } else {
    // автоматично от публикациите на сайта
    const idx = pub.filter((p) => INDEXED.includes(p.cat) || p.ix);
    const mono = pub.filter((p) => p.cat === 'mono');
    const books = pub.filter((p) => p.cat === 'book');
    const other = pub.filter((p) => !INDEXED.includes(p.cat) && !p.ix && !['mono', 'book', 'soft'].includes(p.cat));
    const line = (p: ArchivePub, base: number, ind: string) => { const n = nAuthors(p); return { text: `${p.year}. ${p.title.slice(0, 90)} (${ind}; ${base}/${n})`, pts: r2(base / n) }; };
    const needV = (REQ['В'][col] ?? 0) > 0;
    const plans: { V: Line[]; G: Line[]; vCond?: string }[] = [];
    // план 1: В от ≥ 10 индексирани (оптимален избор), останалите — Г7; монографиите — Г5
    const pick = needV ? chooseV(idx.map((p) => 60 / nAuthors(p))) : null;
    if (pick) {
      const inV = new Set(pick);
      plans.push({ V: pick.map((i) => line(idx[i], 60, 'показател 4')), G: [...idx.filter((_, i) => !inV.has(i)).map((p) => line(p, 40, 'показател 7')), ...mono.map((p) => ({ text: `${p.year}. ${p.title.slice(0, 90)} (показател 5)`, pts: 30 })), ...other.map((p) => line(p, 20, 'показател 8'))] });
    }
    // план 2: монография като хабилитационен труд (В3), всички индексирани — Г7
    if (needV && mono.length) plans.push({ V: [{ text: `${mono[0].year}. ${mono[0].title.slice(0, 90)} (показател 3, монография)`, pts: 100 }], G: [...idx.map((p) => line(p, 40, 'показател 7')), ...mono.slice(1).map((p) => ({ text: `${p.year}. ${p.title.slice(0, 90)} (показател 5)`, pts: 30 })), ...other.map((p) => line(p, 20, 'показател 8'))] });
    // план 3: без В (не е постигнато) — всичко в Г
    plans.push({ V: [], G: [...idx.map((p) => line(p, 40, 'показател 7')), ...mono.map((p) => ({ text: `${p.year}. ${p.title.slice(0, 90)} (показател 5)`, pts: 30 })), ...other.map((p) => line(p, 20, 'показател 8'))], vCond: needV ? `Показател 4 изисква поне 10 публикации в Scopus/WoS със сбор ≥ 100 т. (60/n); на сайта има ${idx.length} индексирани` : undefined });
    const sum = (l: Line[]) => r2(l.reduce((s, x) => s + x.pts, 0));
    const def = (pl: (typeof plans)[0]) => Math.max(0, (REQ['В'][col] ?? 0) - sum(pl.V)) + Math.max(0, (REQ['Г'][col] ?? 0) - sum(pl.G));
    const best = plans.sort((a, b) => def(a) - def(b) || sum(b.V) + sum(b.G) - sum(a.V) - sum(a.G))[0];
    const phd = /д-р|д\.н\./.test(m.title.bg), dsc = /д\.н\./.test(m.title.bg);
    const eLines: Line[] = [...books.map((p) => line(p, 40, 'показател 23, учебник')), ...(dsc ? [{ text: 'Придобита научна степен „доктор на науките“ (показател 16)', pts: 40 }] : [])];
    const G = (key: string, pts: number, lines: Line[], cond?: string): GroupRes => { const req = REQ[key][col] ?? null; return { key, label: LABEL[key], req, pts: r2(pts), deficit: req ? r2(Math.max(0, req - pts)) : 0, lines, cond }; };
    groups = [
      G('А', phd ? 50 : 0, phd ? [{ text: 'Дисертационен труд за ОНС „доктор“ (показател 1)', pts: 50 }] : []),
      G('Б', dsc ? 100 : 0, dsc ? [{ text: 'Дисертационен труд за НС „доктор на науките“ (показател 2)', pts: 100 }] : []),
      G('В', sum(best.V), best.V, best.vCond),
      G('Г', sum(best.G), best.G),
      G('Д', dPts, dLines),
      G('Е', sum(eLines), eLines),
    ];
    notes.push('Изчислено автоматично от публикациите на сайта и от цитиранията в Системата — не е проверена справка.');
    notes.push('Не са изключени трудовете от предишни процедури (за „доцент“ — използваните при хабилитацията); те не се ползват повторно. Проверете списъка.');
    notes.push('Група Е включва само учебниците и степента „доктор на науките“; проектите, ръководството на докторанти, патентите и др. не са в Системата — добавят се с проверена справка.');
    if (pick) notes.push(`Група В: от ${idx.length} индексирани публикации за показател 4 са избрани ${pick.length} — така, че В да се покрие с най-малка загуба на точки за група Г.`);
  }

  // Стратегия: с какво се покрива недостигът (точки по Таблица 2, Област 5)
  for (const g of groups) {
    if (g.cond) steps.push(`Група В: ${g.cond.replace(/[.\s]+$/, '')}.`);
    if (!g.deficit) continue;
    const d = g.deficit, c = (x: number) => Math.ceil(d / x - 1e-9);
    if (g.key === 'Г') steps.push(`Група Г — недостиг ${d} т.: ${c(40)} публикации в Scopus/WoS като единствен автор (40 т.), или ${c(20)} със съавтор (40/2), или ${c(20)} нереферирани с научно рецензиране като единствен автор (20 т.), или ${c(30)} монографии (30 т.).`);
    else if (g.key === 'Д') steps.push(`Група Д — недостиг ${d} т.: ${c(10)} цитирания в Scopus/WoS (Д-12, 10 т.), или ${c(3)} в монографии/сборници с рецензиране (Д-13, 3 т.), или ${c(2)} в нереферирани списания с рецензиране (Д-14, 2 т.). Най-бързо: цитиранията Д-12.`);
    else if (g.key === 'В') steps.push(`Група В — недостиг ${d} т.: хабилитационен труд — монография (100 т.) или поне 10 публикации в Scopus/WoS (60/n всяка).`);
    else if (g.key === 'Е') steps.push(`Група Е — недостиг ${d} т.: участие в национален/международен проект (10/20 т.), ръководство на национален/международен проект (20/40 т.), успешно защитил докторант (40/n), учебник (40/n), патент (40 т.), 1 т. на всеки 5000 лв. привлечени средства.`);
    else if (g.key === 'А') steps.push('Група А: нужен е дисертационен труд за ОНС „доктор“ (50 т.).');
  }
  if (target !== null && !steps.length) steps.push(`Минималните изисквания за „${COLS[target]}“ са покрити по всички групи.`);
  // Очаквано: подадени / под печат
  for (const p of sub) {
    const e = expectedFor(p.venue ?? '');
    const n = nAuthors(p);
    expected.push(`${p.title.slice(0, 90)} — ${e ? `очаквано в Scopus (${e.name}): +${r2(40 / n)} т. за Г (40/${n}) или +1 публикация за показател 4 (60/${n})` : `нереферирано: +${r2(20 / n)} т. за Г (20/${n}), ако е с научно рецензиране`}`);
  }
  return { member: m, target, manual: !!rec, groups, steps, notes, expected, pending: null };
}

/** Писмото (HTML) */
export function strategyHtml(s: Strategy, pending?: { n: number; pts: number } | null) {
  const esc = (t: unknown) => String(t ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]!));
  const f = (x: number) => (Math.round(x * 100) / 100).toLocaleString('bg-BG', { maximumFractionDigits: 2 });
  const col = s.target ?? 4;
  const tgt = s.target === null ? 'няма по-висока длъжност — показан е „Професор“' : `„${COLS[s.target]}“`;
  const th = 'style="border:1px solid #ccc;padding:4px 6px;background:#f2f2f2;text-align:left"', td = 'style="border:1px solid #ccc;padding:4px 6px;vertical-align:top"';
  let h = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.45"><h2>Точки НАЦИД — ${esc(s.member.name.bg)}</h2>`;
  h += `<p>Минимални национални изисквания, Област 5 „Технически науки“ (ППЗРАСРБ; Правилник на БАН, Таблици 1 и 2; Вътрешни правила на ИР-БАН, т. 16). Целева длъжност: <b>${esc(tgt)}</b>.</p>`;
  h += `<table style="border-collapse:collapse"><tr><th ${th}>Група</th>${COLS.map((c, i) => `<th ${th}${i === col ? ' bgcolor="#fff3c4"' : ''}>${c}</th>`).join('')}<th ${th}>Точки</th><th ${th}>Недостиг</th></tr>`;
  for (const g of s.groups) h += `<tr><td ${td}><b>${g.key}</b> ${esc(g.label)}</td>${(REQ[g.key] ?? []).map((r, i) => `<td ${td}${i === col ? ' bgcolor="#fff3c4"' : ''}>${r ?? '–'}</td>`).join('')}<td ${td}><b>${f(g.pts)}</b></td><td ${td}>${g.deficit ? `<b style="color:#b00">${f(g.deficit)}</b>` : g.cond ? '⚠️ условие' : '✓'}</td></tr>`;
  h += `<tr><td ${td} colspan="${COLS.length + 1}"><b>Общо</b></td><td ${td}><b>${f(s.groups.reduce((a, g) => a + g.pts, 0))}</b></td><td ${td}></td></tr></table>`;
  h += `<h3>Стратегия</h3><ul>${s.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  if (pending?.n) h += `<p>В заявката „[Нови цитирания]“ чакат за потвърждаване <b>${pending.n}</b> цитирания на ваши трудове — по предложените показатели около <b>${f(pending.pts)}</b> т. за група Д.</p>`;
  if (s.expected.length) h += `<h3>Подадени и под печат — какво ще добавят</h3><ul>${s.expected.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  h += `<h3>Подробно по групи</h3>`;
  for (const g of s.groups.filter((x) => x.lines.length)) h += `<p><b>${g.key}</b> — ${f(g.pts)} т.</p><ol style="font-size:13px">${g.lines.map((l) => `<li>${esc(l.text)} — ${f(l.pts)} т.</li>`).join('')}</ol>`;
  h += `<h3>Бележки</h3><ul style="font-size:13px">${s.notes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  h += `<p style="font-size:12px;color:#666">Писмото е изпратено само на члена и на ръководителя на лабораторията. Таблицата не се публикува на сайта. Изчислено от Системата на urs.ir.bas.bg.</p></div>`;
  return h;
}
