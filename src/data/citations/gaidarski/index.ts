// Проверени цитирания на трудовете на този член на колектива (формат: ../types.ts; точки: ../rules.ts).
// Добавяйте само цитирания, проверени в самия цитиращ източник; без самоцитирания.
// Цитиранията на общи трудове се отчитат на всички съавтори от колектива (виж ../madzharov/index.ts — номерата са оттам).
import type { CitedWork } from '../types';

const citations: CitedWork[] = [
  {
    no: 44,
    pub: { doi: '10.11610/isij.5546' },
    source: 'Общ труд с А. Маджаров — по справка ver05 (14.10.2026), проверено 16.10.2026',
    cites: [{ year: 2026, ind: '14', doi: '10.7546/PECR.84.26.03', text: 'Yoshinov, R., Dishkova, G., Chehlarova, N. Assessment of Parents’ Awareness in the Field of Cybersecurity. Problems of Engineering Cybernetics and Robotics, vol. 84, Bulgarian Academy of Sciences, 2026, p-ISSN 2738-7356, e-ISSN 2738-7364', url: 'https://www.iict.bas.bg/pecr/2026/84/3-PECR-Yoshinov-Dishkova-Chehlarova.pdf' }],
  },
];

export default citations;
