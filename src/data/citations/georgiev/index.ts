// Проверени цитирания на трудовете на този член на колектива (формат: ../types.ts; точки: ../rules.ts).
// Добавяйте само цитирания, проверени в самия цитиращ източник; без самоцитирания.
// Цитиранията на общи трудове се отчитат на всички съавтори от колектива (виж ../madzharov/index.ts — номерата са оттам).
import type { CitedWork } from '../types';
const IVANOV_2019 = 'Ivanov, V. Use embedded DSP blocks to implement a PID regulator. 19th IFAC Conference on Technology, Culture and International Stability TECIS 2019, Sozopol, Bulgaria, 26–28 September 2019, IFAC-PapersOnLine, 52(25)';

const citations: CitedWork[] = [
  {
    no: 27,
    pub: {},
    hidden: { year: 2004, text: 'Маджаров, А. Н., Георгиев, Р. Ж., Билидеров, С. С. Оптимално управление в надлъжния канал на летателен апарат при външни смущения. Годишник на Техническия университет – София, т. 54, кн. 1, 2004, с. 157–165, ISSN 0374-342X' },
    source: 'Общ труд с А. Маджаров — по справка ver05 (14.10.2026), проверено 16.10.2026',
    cites: [{ year: 2019, ind: '12', index: 'scopus', doi: '10.1016/j.ifacol.2019.12.559', text: IVANOV_2019 }],
  },
];

export default citations;
