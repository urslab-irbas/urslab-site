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
];

export default citations;
