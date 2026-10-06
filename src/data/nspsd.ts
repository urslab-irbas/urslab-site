// Страница „Публикации по ННП „Сигурност и отбрана““ (/projects/nspsd/) — работните екипи в ИР-БАН.
// Записите, които вече са на сайта, се взимат от там (allPubs) — изписването на сайта е водещо.
// nspsdExtra — публикации от отчета, които не са в публикациите на лабораторията (други екипи на ИР-БАН
// или статии под печат). Форматът е описан в archive2022.ts.
import type { ArchivePub } from './archive2022';
import { allPubs } from './allPubs';
import { withNrs } from './archivePages';
import { NSPDS_FUND, nspsdRefs, normTitle } from './nspsdRefs';

const nspsdExtra: ArchivePub[] = [
  {
    year: 2024, cat: 'other', team: [], tags: ['robotics', 'security'],
    authors: 'Valchkova, N., Zahariev, R., Angelov, G., Paunski, Y., Varbanov, I.',
    title: 'Мобилен колаборативен робот с висока проходимост за антитерористични операции',
    tr: 'Mobile collaborative robot with high cross-country capability for anti-terrorist operations',
    venue: 'Black Sea Maritime Security Conference, Nikola Vaptsarov Naval Academy, Varna, 6–8 November 2024',
    doi: '10.63662/5stkwe27', url: 'https://journal.nvna.eu/index.php/msfj/article/view/194/54',
  },
  {
    year: 2024, cat: 'other', team: [], tags: ['robotics'],
    authors: 'Tzvetkov, V., Valchkova, N., Zahariev, R.',
    title: 'Sensory System for Controlling Robot’s Motion',
    venue: 'Complex Control Systems 8, IR-BAS', url: 'http://ir.bas.bg/ccs/2024/08/15.pdf',
  },
  {
    year: 2023, cat: 'other', team: [], tags: ['robotics'],
    authors: 'Райков, П., Вълчкова, Н., Захариев, Р.',
    title: 'Алгоритми за моделиране на движенията на роботи с неявно решима позиционна задача на кинематичния анализ за помощ в здравеопазването',
    tr: 'Algorithms for modelling the motions of robots with an implicitly solvable position problem of kinematic analysis for assistance in healthcare',
    venue: 'Complex Control Systems, IR-BAS',
  },
  {
    year: 2025, cat: 'sub', st: 'in-press', team: ['gaidarski'], tags: ['security', 'ai'],
    authors: 'Gaidarski, I.',
    title: 'Using disruptive technologies as Blockchains and AI in IoT cybersecurity',
    venue: 'Int. Scientific Conference “Robotics & Mechatronics 2025”, Complex Control Systems', issn: '2603-4697 (online)',
  },
  {
    year: 2026, cat: 'sub', st: 'in-press', team: ['aleksandrov'], tags: ['ai'],
    authors: 'Alexandrov, A.',
    title: 'Small Voice Bulgarian Language Model Generation Based on Vosk-Type Methods and Algorithms',
    venue: 'TechSys 2026 — 15th Int. Scientific Conference on Engineering, Technology and Systems, MDPI Engineering Proceedings',
  },
  {
    year: 2026, cat: 'sub', st: 'in-press', team: ['aleksandrov'], tags: ['ai'],
    authors: 'Alexandrov, A.',
    title: 'Neural Network Approaches for Speech Recognition and Synthesis based on Whisper',
    venue: 'INFUS 2026, Ankara, Turkey — Springer, Lecture Notes in Networks and Systems',
  },
  {
    year: 2026, cat: 'sub', st: 'in-press', team: ['aleksandrov'], tags: ['ai'],
    authors: 'Alexandrov, A.',
    title: 'Data-Driven Fuzzy Systems for Urban Microclimate Prediction',
    venue: 'INFUS 2026, Ankara, Turkey — Springer, Lecture Notes in Networks and Systems',
  },
];

const pool: ArchivePub[] = [...allPubs, ...nspsdExtra.map(withNrs)];

/** Всички публикации по ННП-СО, с маркировка за финансиране и задача по програмата */
export const nspsdPubs: ArchivePub[] = nspsdRefs.map((r) => {
  const key = normTitle(r.t);
  const p = pool.find((x) => normTitle(x.title).includes(key));
  if (!p) throw new Error(`nspsd: няма публикация на сайта или в nspsdExtra за „${r.t}“`);
  return { ...p, fund: NSPDS_FUND, task: r.task };
});
