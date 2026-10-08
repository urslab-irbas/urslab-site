// Страница „Публикации по ННП „Сигурност и отбрана““ (/projects/nspsd/) — работните екипи в ИР-БАН.
// Записите, които вече са на сайта, се взимат от там (allPubs) — изписването на сайта е водещо.
// nspsdExtra — публикации от отчета, които не са в публикациите на лабораторията (други екипи на ИР-БАН
// или статии под печат). Форматът е описан в archive2022.ts.
import type { ArchivePub } from './archive2022';
import { allPubs } from './allPubs';
import { withNrs } from './archivePages';
import { withShare } from './irShare';
import { NSPDS_FUND, nspsdRefs, normTitle } from './nspsdRefs';

// team: 'valchkova', 'zahariev' — колеги от ИР-БАН извън лабораторията; бутони във филтъра „Автор“ само на страницата на програмата
const nspsdExtra: ArchivePub[] = [
  // по справката на И. Гайдарски (06.10.2026)
  {
    year: 2026, cat: 'sub', st: 'in-press', team: ['gaidarski'], tags: ['security', 'education'],
    authors: 'Djambazova, E., Gaidarski, I., Ilchev, S., Terzieva, V.',
    title: 'Information security and dependability in integrated intelligent educational environments',
    venue: 'Advances and Problems in Intelligent Systems (V. Sgurev, V. Jotsov, V. Piuri, L. Doukovska, Eds.) — Springer Nature, Studies in Systems, Decision and Control 637, Chap. 15',
    issn: '2198-4182 (print), 2198-4190 (online)',
  },
  {
    year: 2025, cat: 'sub', st: 'in-press', team: ['gaidarski'], tags: ['security'],
    authors: 'Gaidarski, I.',
    title: 'Designing an information security system to prevent leakage of sensitive information',
    venue: '2025 International Conference on Military Communication and Information Systems (ICMCIS 2025), NATO STO',
  },
  {
    year: 2025, cat: 'sub', st: 'in-press', team: ['gaidarski'], tags: ['security'],
    authors: 'Gaidarski, I.',
    title: 'Multilayered conceptual modelling for the design, implementation and optimization of information security systems',
    venue: 'ICDTDE 2025 — International Conferences on Digital Technology Driven Engineering, Springer, Lecture Notes in Civil Engineering',
  },
  {
    year: 2024, cat: 'other', team: ['valchkova', 'zahariev'], tags: ['robotics', 'security'],
    authors: 'Valchkova, N., Zahariev, R., Angelov, G., Paunski, Y., Varbanov, I.',
    title: 'Мобилен колаборативен робот с висока проходимост за антитерористични операции',
    tr: 'Mobile collaborative robot with high cross-country capability for anti-terrorist operations',
    venue: 'Морски научен форум, т. 10, бр. 1: Национална научна програма „Сигурност и отбрана“ – състояние и постигнати резултати (конференция 5–6 ноември 2024 г., ВВМУ „Н. Й. Вапцаров“), с. 129–137',
    issn: '1310-9278 (print), 3033-1889 (online)',
    doi: '10.63662/5stkwe27', url: 'https://journal.nvna.eu/index.php/msfj/article/view/194',
  },
  {
    year: 2024, cat: 'other', team: ['valchkova', 'zahariev'], tags: ['robotics'],
    authors: 'Tzvetkov, V., Valchkova, N., Zahariev, R.',
    title: 'Sensory System for Controlling Robot’s Motion',
    venue: 'Complex Control Systems 8, IR-BAS', url: 'http://ir.bas.bg/ccs/2024/08/15.pdf',
  },
  {
    year: 2023, cat: 'other', team: ['valchkova', 'zahariev'], tags: ['robotics'],
    authors: 'Райков, П., Вълчкова, Н., Захариев, Р.',
    authorsEn: 'Raykov, P., Valchkova, N., Zahariev, R.',
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

// по отчета на проф. Р. Захариев и доц. Н. Вълчкова по задача 1.2.3 (08.10.2026) — само на страницата на програмата;
// данните са по издателя (Crossref / сайта на изданието), не по отчета
const zahariev2026: ArchivePub[] = [
  {
    year: 2026, cat: 'other', team: ['valchkova', 'zahariev'], tags: ['robotics'],
    authors: 'Valchkova, N., Zahariev, R., Tsvetkov, V., Paunski, Y., Angelov, G.',
    title: 'Power Supply Technologies for Collaborative Service Robots: Characteristics and Comparative Overview',
    venue: 'The Eurasia Proceedings of Science, Technology, Engineering and Mathematics (EPSTEM) 40 — ICBAST 2026, Konya, Türkiye, pp. 374–390',
    doi: '10.55549/epstem.1461', issn: '2602-3199',
    abstract: 'The article examines the power supply of a Service Collaborative Robot, powered by a hydrogen fuel cell, intended for transporting seriously injured people and serving them in medical facilities. The qualities of this power supply are analyzed, highlighting its advantages in terms of environmental characteristics and its long "life" during the activities of serving patients in serious health conditions and transporting them to a hospital. Some main characteristics of this type of robot, powered by a hydrogen fuel cell, are analyzed, compared with robots powered by other types of power supplies, and its advantages when working in a hospital are shown.',
  },
  {
    year: 2026, cat: 'q4', sjr: 0.165, team: ['valchkova', 'zahariev'], tags: ['robotics', 'ai'],
    authors: 'Valchkova, N., Zahariev, R., Tsvetkov, V.',
    title: 'Intelligent Control and Sensor Fusion for a Tracked Mobile Collaborative Robot Operating in Unstructured Environments',
    venue: 'Computer Vision and Computational Intelligence (CVC 2026), Amsterdam — Springer, Lecture Notes in Networks and Systems, pp. 189–203',
    doi: '10.1007/978-3-032-26214-1_12', isbn: '978-3-032-26213-4 (print), 978-3-032-26214-1 (online)', issn: '2367-3370 (print), 2367-3389 (online)',
  },
  {
    year: 2025, cat: 'other', team: ['valchkova', 'zahariev'], tags: ['robotics'],
    authors: 'Zahariev, R., Valchkova, N.',
    title: 'Analysis of the Characteristics of the Power Types of Collaborative Service Robots',
    venue: 'Complex Control Systems 9(2) — Int. Scientific Conference “Robotics & Mechatronics 2025”, 5–6 November 2025, IR-BAS, Sofia',
    url: 'https://ir.bas.bg/ccs/2025/09.2/17.pdf',
  },
  {
    year: 2025, cat: 'other', team: ['valchkova', 'zahariev'], tags: ['robotics', 'hri'],
    authors: 'Valchkova, N., Zahariev, R.',
    title: 'Off-Road Mobile Collaborative Robot for Healthcare',
    venue: 'Proceedings of ARCI 2025 — Automation, Robotics & Communications for Industry 4.0/5.0, IFSA Publishing, pp. 167–171',
    isbn: '978-84-09-69171-5', issn: '2938-4796',
  },
];

const pool: ArchivePub[] = [...allPubs, ...[...nspsdExtra, ...zahariev2026].map(withNrs).map(withShare)];

/** Всички публикации по ННП-СО, с маркировка за финансиране и задача по програмата */
export const nspsdPubs: ArchivePub[] = nspsdRefs.map((r) => {
  const key = normTitle(r.t);
  const p = pool.find((x) => normTitle(x.title).includes(key));
  if (!p) throw new Error(`nspsd: няма публикация на сайта или в nspsdExtra за „${r.t}“`);
  return { ...p, fund: NSPDS_FUND, task: r.task, fundVia: r.via };
});
