// Публикации 2026 г. — по отчета на БАН „XX а: Всички публикации – публикувани“ (звено ИР), изготвен на 02.10.2026.
// Форматът е описан в archive2022.ts. share — „Процент автори от звеното“ от отчета.
import type { ArchivePub } from './archive2022';

export const archive2026: ArchivePub[] = [
  {
    year: 2026, cat: 'q3', sjr: 0.254, share: 100, team: ['madzharov', 'hristozov', 'gaidarski'], tags: ['navigation', 'ins'],
    authors: 'Madzharov, A., Hristozov, S., Gaidarski, I.',
    title: 'Compensations for Horizontal Inertial Components of INS/GNSS with Flight Altitude',
    venue: 'Engineering Proceedings 150(1), 70, MDPI', doi: '10.3390/engproc2026150070',
  },
  {
    year: 2026, cat: 'q3', sjr: 0.254, share: 100, team: ['gaidarski', 'madzharov'], tags: ['security'],
    authors: 'Gaidarski, I., Madzharov, A.',
    title: 'Constructive Approach to the Design of Data Protection Systems: Models and Transformation',
    venue: 'Engineering Proceedings 150(1), 53, MDPI', doi: '10.3390/engproc2026150053',
  },
  {
    year: 2026, cat: 'q4', sjr: 0.15, share: 100, team: ['gaidarski'], tags: ['security'],
    authors: 'Gaidarski, I.',
    title: 'Insider Threats in Critical Infrastructure Organizations — Discovery and Protection',
    venue: 'BISEC 2025, Belgrade Metropolitan University, pp. 86–97', isbn: '978-86-89755-40-4', doi: '10.46793/BISEC25.086G',
  },
  {
    year: 2026, cat: 'idx', share: 100, team: ['chehlarova'], tags: ['hri', 'education', 'robotics'],
    authors: 'Dimitrova, M., Krastev, A., Chehlarova, N., Tanev, T.',
    title: 'Design of Educational Scenarios with Robots from a Neuro Aware Perspective',
    venue: 'IEEE ITHET 2026 — 22nd Int. Conf. on Information Technology Based Higher Education and Training', isbn: '979-8-3315-1664-2', doi: '10.1109/ithet69978.2026.11585097',
  },
  {
    year: 2026, cat: 'intl', ix: true, share: 100, team: ['aleksandrov'], tags: ['security', 'wsn', 'ai'],
    authors: 'Alexandrov, A.',
    title: 'Formal Modeling of Security Dynamics in Sensor Networks Using Fuzzy Inference Systems',
    venue: 'BISEC 2025, pp. 76–85 (Scopus)', doi: '10.46793/BISEC25.076A',
  },
  {
    year: 2026, cat: 'nat', share: 33.33, team: ['chehlarova'], tags: ['security', 'education'],
    authors: 'Yoshinov, R., Chehlarova, N., Dishkova, G.',
    title: 'Assessment of teachers’ preparedness in cybersecurity',
    venue: 'Problems of Engineering Cybernetics and Robotics 84, BAS, pp. 21–34', doi: '10.7546/PECR.84.26.02',
  },
  {
    year: 2026, cat: 'nat', share: 33.33, team: ['chehlarova'], tags: ['security', 'education'],
    authors: 'Yoshinov, R., Dishkova, G., Chehlarova, N.',
    title: 'Assessment of Parents’ Awareness in the Field of Cybersecurity',
    venue: 'Problems of Engineering Cybernetics and Robotics 84, BAS, pp. 35–45', doi: '10.7546/PECR.84.26.03',
  },
  {
    year: 2026, cat: 'nat', share: 50, team: ['chehlarova'], tags: ['security', 'education'],
    authors: 'Dishkova, G., Chehlarova, N.',
    title: 'Recognition and prevention of cyberbullying by students in secondary education',
    venue: 'Complex Control Systems 10(2), IR-BAS, pp. 166–171',
  },
];
