// Проверени цитирания на трудовете на този член на колектива (формат: ../types.ts; точки: ../rules.ts).
// Добавяйте само цитирания, проверени в самия цитиращ източник; без самоцитирания.
import type { CitedWork } from '../types';

const citations: CitedWork[] = [
  {
    // общ труд с А. Маджаров — цитирането се отчита на всички съавтори от колектива (виж ../madzharov/index.ts, № 38)
    no: 38,
    pub: { doi: '10.3389/frobt.2024.1414853' }, // Psychophysics of user acceptance of social cyber-physical systems (2024)
    source: 'Проверено в PDF на цитиращата статия, 16.10.2026 (потвърдено от А. Маджаров)',
    cites: [
      { year: 2025, ind: '14', where: '[6]', url: 'https://rostransport.elpub.ru/jour/article/view/413/295', text: 'Булатова, О. Ю., Зырянов, В. В. Концепция жизненного цикла кибер-физико-социальной транспортной системы в период проведения массовых мероприятий [Lifecycle Concept of a Cyber-Physical-Social Transport System During Mass Events]. Транспорт Российской Федерации, 2025, № 6 (121), с. 50–54', evidence: 'PDF на статията (16.10.2026): в литературата, позиция 6 — Dimitrova M., Chehlarova N., Madzharov A. et al. Psychophysics of user acceptance of social cyber-physical systems // Frontiers in Robotics and AI. 2024. № 11. DOI 10.3389/frobt.2024.1414853; в текста — (M. Dimitrova et al., 2024)', evidenceUrl: 'https://rostransport.elpub.ru/jour/article/view/413/295' },
    ],
  },
  {
    no: 41,
    pub: { doi: '10.17770/etr2024vol4.8238' },
    source: 'Общ труд с А. Маджаров — по справка ver05 (14.10.2026), проверено 16.10.2026',
    cites: [{ year: 2026, ind: '14', doi: '10.35467/cal/220521', text: 'Kaczmarek, K. Cyber-deterrence of Finland and the Nordic countries – a model of digital deterrence and state security. Cybersecurity and Law, vol. 15, no. 1, 2026, pp. 69–79', url: 'https://czasopismocybersecurityandlaw.pl/Cyber-deterrence-Finlandii-i-panstw-nordyckich-model-odstraszania-cyfrowego-a-bezpieczenstwo,220521,0,1.html' }],
  },
  {
    no: 42,
    pub: { doi: '10.17770/etr2024vol2.8064' },
    source: 'Общ труд с А. Маджаров — по справка ver05 (14.10.2026), проверено 16.10.2026',
    cites: [{ year: 2026, ind: '12', index: 'wos', doi: '10.53656/math2026-3-5-sar', text: 'Petkov, I. STEM in action – role-playing games and artificial intelligence in the modern classroom. Mathematics and Informatics, 69(3), 2026, pp. 315–326', note: 'Web of Science (ESCI); не е в Scopus.' }],
  },
  // ---- По регистъра на НАЦИД (процедура „доцент“, 16.10.2025; Д-12, 7 цитирания — 70 т.) — 23.10.2026 ----
  // Calderón et al. (2025) на „Management approaches …“ вече е в Системата (въведено с отметка).
  // Тези цитирания са представени за „доцент“ — за „професор“ не се ползват повторно (ППЗРАСРБ, Приложение, т. 9).
  {
    no: 7, pub: {}, hidden: { year: 2021, text: 'Chehlarova, N. Axes of symmetry dominoes. Symmetry: Culture and Science, Vol. 32, Num. 1, 2021, pp. 103–111, ISSN 0865-4824, DOI 10.26830/symmetry_2021_1_103 (Scopus & WoS)' },
    source: 'НАЦИД, регистър — процедура „доцент“ (16.10.2025), справка 23.10.2026',
    cites: [
      { year: 2024, ind: '12', index: 'wos', text: 'Karashtranova, E., Goldreich, A., Borisova, N. On integration of STEM modules in mathematics education. Mathematics and Informatics, Az-buki, Vol. 67, No. 2, 2024, pp. 119–131, ISSN 1310-2230, eISSN 1314-8532', url: 'https://www.webofscience.com/wos/woscc/full-record/WOS:001310598800001' },
      { year: 2024, ind: '12', index: 'wos', doi: '10.53656/ped2024-2s.02', text: 'Goldreich, A., Karashtranova, E. Israeli math teachers’ view on integration of STEM modules in mathematics studies as a motivator in 9th grade. Pedagogika-Pedagogy, Az-buki, Vol. 96, Iss. 2s, 2024, pp. 16–28, ISSN 0861-3982, eISSN 1314-8540' },
      { year: 2021, ind: '12', index: 'wos', text: 'Андреев, Ц. За природата на математиката и за математиката в природата – една приказка за симетрията с продължение за малки и големи. Математика и информатика, Азбуки, Т. 64, Бр. 4, 2021, с. 425–436, ISSN 1310-2230, eISSN 1314-8532', url: 'https://www.webofscience.com/wos/woscc/full-record/WOS:000710556200005' },
    ],
  },
  {
    no: 6, pub: { doi: '10.26830/symmetry_2021_2_281' }, // Computer model for self-preparation … “Axes of symmetry” (2021)
    source: 'НАЦИД, регистър — процедура „доцент“ (16.10.2025), справка 23.10.2026',
    cites: [
      { year: 2024, ind: '12', index: 'wos', text: 'Гачев, Г. Програмна реализация на играта „Комбинация девет“. Математика и информатика, Азбуки, Т. 67, Бр. 3, 2024, ISSN 1310-2230, eISSN 1314-8532', url: 'https://www.webofscience.com/wos/woscc/full-record/WOS:001310591000005' },
    ],
  },
  {
    no: 3, pub: { doi: '10.1109/ELECTRONICA52725.2021.9513705' }, // Digital competencies of public administration employees … (2021)
    source: 'НАЦИД, регистър — процедура „доцент“ (16.10.2025), справка 23.10.2026',
    cites: [
      { year: 2023, ind: '12', index: 'scopus', doi: '10.1007/978-3-031-27034-5_3', text: 'Dimitrova, Z., Borissova, D., Mikhov, R., Dimitrov, V. Group Decision-Making Involving Competence of Experts in Relation to Evaluation Criteria: Case Study for e-Commerce Platform Selection. MDIS 2022, Communications in Computer and Information Science 1761, Springer, Cham, 2023, pp. 42–53, ISSN 1865-0929, ISBN 978-3-031-27033-8' },
      { year: 2022, ind: '12', index: 'scopus', doi: '10.1145/3543434.3543476', text: 'Koddebusch, M. Exposing the Phish: The Effect of Persuasion Techniques in Phishing E-Mails. DG.O 2022: The 23rd Annual International Conference on Digital Government Research, ACM, New York, 2022, pp. 78–87, ISBN 978-1-4503-9749-0' },
    ],
  },
];

export default citations;
