// Б4: писмото „Точки НАЦИД“ за един член (стартира се от .github/workflows/nacid-table.yml).
//   npx tsx scripts/nacid-mail.ts <член>
// Изход: nacid-mail.html (писмото) и nacid-mail.json ({ member, name, subject }). Нищо не се публикува на сайта.
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
writeFileSync('nacid-mail.html', strategyHtml(s, pending));
// темата е неутрална: дневникът на изпълнението в GitHub е публичен (резултатът е само в писмото)
const subject = `URSlab: Точки НАЦИД — ${s.member.name.bg}`;
writeFileSync('nacid-mail.json', JSON.stringify({ member: id, name: s.member.name.bg, subject }));
console.log(subject);
