// Проверени цитирания на трудовете на този член на колектива (формат: ../types.ts; точки: ../rules.ts).
// Добавяйте само цитирания, проверени в самия цитиращ източник; без самоцитирания.
// Цитиранията на общи трудове се отчитат на всички съавтори от колектива (виж ../madzharov/index.ts — номерата са оттам).
import type { CitedWork } from '../types';
const ANGELOV_2025 = 'Angelov, S. Design and Architecture of Robotized Unmanned Ground Vehicle (UGV)-Based Intrusion Detection Perimeter Security Systems. Complex Control Systems, 2025, 9(2), pp. 1–6, ISSN 1310-8255, e-ISSN 2603-4697';

const citations: CitedWork[] = [
  {
    no: 36,
    pub: { doi: '10.5281/zenodo.10684996' },
    source: 'Общ труд с А. Маджаров — по справка ver05 (14.10.2026), проверено 16.10.2026',
    cites: [{ year: 2025, ind: '13', text: ANGELOV_2025, url: 'http://ir.bas.bg/ccs/2025/09/2.pdf' }],
  },
  {
    no: 37,
    pub: { title: 'Design of marine underwater perimeter security system' },
    source: 'Общ труд с А. Маджаров — по справка ver05 (14.10.2026), проверено 16.10.2026',
    cites: [{ year: 2025, ind: '13', text: ANGELOV_2025, url: 'http://ir.bas.bg/ccs/2025/09/2.pdf' }],
  },
  {
    no: 40,
    pub: { doi: '10.5281/zenodo.11396636' },
    source: 'Общ труд с А. Маджаров — по справка ver05 (14.10.2026), проверено 16.10.2026',
    cites: [{ year: 2025, ind: '13', text: ANGELOV_2025, url: 'http://ir.bas.bg/ccs/2025/09/2.pdf' }],
  },
];

export default citations;
