// Проверени цитирания на трудовете на този член на колектива (формат: ../types.ts; точки: ../rules.ts).
// Добавяйте само цитирания, проверени в самия цитиращ източник; без самоцитирания.
import type { CitedWork } from '../types';

const citations: CitedWork[] = [
  {
    // общ труд с А. Маджаров — цитирането се отчита на всички съавтори от колектива (виж ../madzharov/index.ts, № 38)
    no: 1,
    pub: { doi: '10.3389/frobt.2024.1414853' }, // Psychophysics of user acceptance of social cyber-physical systems (2024)
    source: 'Проверено в PDF на цитиращата статия, 16.10.2026 (потвърдено от А. Маджаров)',
    cites: [
      { year: 2025, ind: '14', where: '[6]', url: 'https://rostransport.elpub.ru/jour/article/view/413/295', text: 'Булатова, О. Ю., Зырянов, В. В. Концепция жизненного цикла кибер-физико-социальной транспортной системы в период проведения массовых мероприятий [Lifecycle Concept of a Cyber-Physical-Social Transport System During Mass Events]. Транспорт Российской Федерации, 2025, № 6 (121), с. 50–54', evidence: 'PDF на статията (16.10.2026): в литературата, позиция 6 — Dimitrova M., Chehlarova N., Madzharov A. et al. Psychophysics of user acceptance of social cyber-physical systems // Frontiers in Robotics and AI. 2024. № 11. DOI 10.3389/frobt.2024.1414853; в текста — (M. Dimitrova et al., 2024)', evidenceUrl: 'https://rostransport.elpub.ru/jour/article/view/413/295' },
    ],
  },
];

export default citations;
