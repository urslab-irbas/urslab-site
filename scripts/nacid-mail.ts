// Б4: писмото „Точки НАЦИД“ за един член (стартира се от .github/workflows/nacid-table.yml).
//   npx tsx scripts/nacid-mail.ts <член>
// Изход: nacid-report.html (справката — workflow-ът я печата в PDF и я прилага към писмото), nacid-mail.html (кратък текст
// на писмото) и nacid-mail.json ({ member, name, subject, pdf }). Нищо не се публикува на сайта.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { strategyFor, strategyHtml } from '../src/data/strategy';
import { team } from '../src/data/team';

const id = process.argv[2];
if (!team.some((m) => m.id === id)) { console.error(`няма потребител „${id}“`); process.exit(2); }
const s = strategyFor(id);
// чакащите за потвърждаване цитирания (последното търсене) — по предложения показател
let pending: { n: number; pts: number } | null = null;
const F = 'citation-scan/candidates.json';
if (existsSync(F)) {
  const PTS: Record<string, number> = { '12s': 10, '12w': 10, '13': 3, '14': 2 };
  const it = Object.values((JSON.parse(readFileSync(F, 'utf8')).items ?? {}) as Record<string, { status: string; eligible?: string[]; owners: string[]; suggest?: string }>)
    .filter((x) => x.status === 'ready' && (x.eligible ?? x.owners).includes(id));
  pending = { n: it.length, pts: it.reduce((a, x) => a + (PTS[x.suggest ?? ''] ?? 0), 0) };
}
const today = new Date().toISOString().slice(0, 10);
const dateBg = today.split('-').reverse().join('.');
// справката като самостоятелна HTML страница за печат в PDF (A4)
writeFileSync('nacid-report.html', `<!doctype html><html lang="bg"><head><meta charset="utf-8"><title>Точки НАЦИД — ${s.member.name.bg}</title>
<style>@page{size:A4;margin:16mm 14mm 18mm}body{margin:0;color:#111}table{width:100%;font-size:12px}tr{break-inside:avoid}h2{margin-top:0}
.foot{margin-top:18px;padding-top:6px;border-top:1px solid #ccc;font-size:11px;color:#555}</style></head><body>
${strategyHtml(s, pending)}
<div class="foot">URSlab — Лаборатория „Безекипажни роботизирани системи“, Институт по роботика – БАН · справка от ${dateBg} · само за потребителя и ръководителя</div>
</body></html>`);
// краткият текст на писмото — самата справка е в приложения PDF
writeFileSync('nacid-mail.html', `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.45"><p>Здравейте,</p>
<p>Приложена е справката „Точки НАЦИД“ (PDF) за ${s.member.name.bg} към ${dateBg}: таблицата по минималните национални изисквания, стратегията за следващата длъжност${s.registry ? ' и справката за трудовете ви в регистъра на НАЦИД' : ''}.</p>
<p>Справката се изпраща само на потребителя и на ръководителя на лабораторията.</p><p>URSlab</p></div>`);
// темата и името на файла са неутрални: дневникът на изпълнението в GitHub е публичен (резултатът е само в PDF)
const subject = `URSlab: Точки НАЦИД — ${s.member.name.bg}`;
const pdf = `URSlab-NACID-${id}-${today}.pdf`;
writeFileSync('nacid-mail.json', JSON.stringify({ member: id, name: s.member.name.bg, subject, pdf }));
console.log(subject);
