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
  {
    // Modeling and deployment of data protection as component of information security systems (ICICSG 2017, Istanbul Gelisim University).
    // Няма номер в регистъра на НАЦИД; номерът продължава списъка на члена (виж ../madzharov/index.ts за 50 и 51).
    no: 45,
    pub: { title: 'Modeling and deployment of data protection' },
    source: 'Проверено в цитиращите източници (библиография), 13.11.2026',
    cites: [
      {
        year: 2023, ind: '13', where: 'библиография, № 165',
        text: 'Chehlarova, N. (2023). Research of the e-business system in the context of increasing the digital competences of consumers. Tonediko, ISBN 978-619-91492-8-7. Монография с двама рецензента.',
        verified: ['проверено в PDF на книгата, библиография № 165'],
      },
      {
        year: 2021, ind: '12', index: 'scopus', where: 'библиография, № 17',
        doi: '10.1109/RTUCON53541.2021.9711588',
        text: 'Dimitrov, W., Panayotova, G., Jekov, B., & Hoti, L. (2021). Distance learning and work during the Corona virus pandemic. 2021 IEEE 62nd International Scientific Conference on Power and Electrical Engineering of Riga Technical University (RTUCON), pp. 1–5.',
        evidence: 'doi', evidenceUrl: 'https://ieeexplore.ieee.org/document/9711588/references',
      },
      {
        year: 2019, ind: '12', index: 'scopus', where: 'библиография, № 4',
        doi: '10.1109/BdKCSE48644.2019.9010607',
        text: 'Dimitrov, W., & Syarova, S. (2019). Analysis of the functionalities of a shared ICS security operations center. 2019 Big Data, Knowledge and Control Systems Engineering (BdKCSE), pp. 1–6.',
        evidence: 'doi', evidenceUrl: 'https://ieeexplore.ieee.org/document/9010607/references',
      },
    ],
  },
];

export default citations;
