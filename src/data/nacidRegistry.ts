// Регистър за академичните длъжности и дисертации на НАЦИД (ras.nacid.bg) — справки на потребителите (23.10.2026).
// Публикациите от регистъра са в Системата: тези, които вече са на сайта, остават с досегашните си записи (`site`);
// останалите са НЕВИДИМИ — не се показват в списъците на сайта, ползват се само за цитиранията и за „Точки НАЦИД“.
// Процедурите (ОНС „доктор“, „доцент“ …) с представените в тях публикации и цитирания: по ППЗРАСРБ, Приложение,
// т. 8 и 9 представеното в една процедура не се ползва повторно — за „доцент“ не се повтарят представените за
// „доктор“ / „доктор на науките“; за „професор“ — и представените за „доцент“; цитиранията от една процедура
// не се ползват в друга. Стратегията (strategy.ts) ги изключва според целевата длъжност.
// Проверената справка на А. Маджаров е в nacid.ts (процедурата „доцент“ 2021 г. се въвежда в НАЦИД — по-късно).

export type ProcKind = 'phd' | 'dsc' | 'assoc' | 'chief';
export interface RegPub {
  no: number;          // пореден номер в регистъра
  year: number;
  title: string;
  venue: string;       // издателски данни, както са в регистъра
  index?: string;      // бази, в които е реферирана / индексирана (по регистъра)
  coauthors?: string;  // съавторите (по регистъра)
  /** на сайта: откъс от заглавието на съществуващия запис (записът се запазва); без него — невидим запис */
  site?: string;
}
export interface ProcItem { ind: string; title: string; pts: number }
export interface Procedure {
  kind: ProcKind;
  label: string;       // напр. ОНС „доктор“ — БАН, ИИКТ
  date: string;        // защита / акт за назначаване
  total: number;
  items: ProcItem[];   // представените публикации и показатели (без А1 — дисертацията)
  citations?: { cited: string; citing: string; pts: number }[];
}
export interface Registry { member: string; url?: string; checked: string; publications: RegPub[]; procedures: Procedure[] }

const gaidarski: Registry = {
  member: 'gaidarski', checked: '23.10.2026',
  publications: [
    { no: 5, year: 2021, title: 'Model Driven Development of Information Security System', venue: 'Problems of Engineering Cybernetics and Robotics, BAS, 2021, Vol. 76, pp. 47–62, p-ISSN 2738-7356, e-ISSN 2738-7364, DOI 10.7546/PECR.76.21.04', site: 'Model Driven Development of Information Security System' },
    { no: 4, year: 2019, title: 'Model Driven Architectural Design of Information Security System', venue: 'Advances in Intelligent Systems and Computing 942, Proceedings of the Tenth International Conference on Soft Computing and Pattern Recognition (SoCPaR 2018), Springer, 2019, pp. 349–359, ISBN 978-3-030-17064-6, ISSN 2194-5357, DOI 10.1007/978-3-030-17065-3_35', index: 'Scopus', coauthors: 'Gaydarski, I., Minchev, Z., Andreev, R.' },
    { no: 3, year: 2018, title: 'Virtual Enterprise Data Protection: Framework Implementation with Practical Validation', venue: 'Proceedings of BISEC 2018, October 20, Belgrade, Serbia, Belgrade Metropolitan University, 2019, pp. 10–15, ISBN 978-86-89755-17-6, DOI 10.13140/RG.2.2.19996.33925', coauthors: 'Gaydarski, I., Minchev, Z.' },
    { no: 2, year: 2017, title: 'Holistic Approach to Data protection – identifying the weak points in the organization', venue: 'Proceedings of BdKCSE’2017 (7 December 2017, Sofia), САИ, 2018, pp. 125–135, ISSN 2367-6450', coauthors: 'Gaydarski, I., Kutinchev, P.' },
    { no: 1, year: 2017, title: 'Conceptual Modeling of Information Security System and Its Validation Through DLP Systems', venue: 'Proceedings of BISEC 2017, Belgrade Metropolitan University, 2017, pp. 36–40, ISBN 978-86-89755-14-5, DOI 10.13140/RG.2.2.32836.53123', coauthors: 'Gaydarski, I., Minchev, Z.' },
  ],
  procedures: [
    { kind: 'phd', label: 'ОНС „доктор“ — БАН, ИИКТ (5.3), диплома 001449 / 19.05.2022', date: '14.04.2022', total: 113, items: [
      { ind: 'Г7', title: 'Model Driven Architectural Design of Information Security System', pts: 13.33 },
      { ind: 'Г8', title: 'Model Driven Development of Information Security System', pts: 20 },
      { ind: 'Г8', title: 'Conceptual Modeling of Information Security System and Its Validation Through DLP Systems', pts: 10 },
      { ind: 'Г8', title: 'Holistic Approach to Data protection', pts: 10 },
      { ind: 'Г8', title: 'Virtual Enterprise Data Protection: Framework Implementation with Practical Validation', pts: 10 },
    ] },
    { kind: 'chief', label: 'Главен асистент — БАН, ИР (5.2), акт 1127 / 07.04.2023', date: '07.04.2023', total: 50, items: [] },
  ],
};

const hristozov: Registry = {
  member: 'hristozov', url: 'https://ras.nacid.bg/dissertation-preview/73057', checked: '23.10.2026',
  publications: [
    { no: 3, year: 2019, title: 'Total Hazard and Risk Assessment for RPAS Technology', venue: '6th International Conference on Application of Information and Communication Technology and Statistics in Economy and Education (ICAICTSEE), УНСС, ISSN 2367-7643, pp. 385–390' },
    { no: 2, year: 2019, title: 'A Fuzzy Logic Approach for Drone Capability Analysis on Disaster Risk Assessment', venue: 'The International Archives of the Photogrammetry, Remote Sensing and Spatial Information Sciences, XLII-3/W8, ISPRS, 2019, pp. 485–489, ISSN 1682-1750, DOI 10.5194/isprs-archives-XLII-3-W8-485-2019', index: 'Scopus', coauthors: 'Zlateva, P., Velev, D.' },
    { no: 1, year: 2018, title: 'Concept Model for Drone Selection in Specific Disaster Conditions', venue: 'The International Archives of the Photogrammetry, Remote Sensing and Spatial Information Sciences, XLII-3/W4, ISPRS, 2018, pp. 245–249, ISSN 1682-1750, DOI 10.5194/isprs-archives-XLII-3-W4-245-2018', index: 'Scopus', coauthors: 'Zlateva, P.' },
  ],
  procedures: [
    { kind: 'phd', label: 'ОНС „доктор“ — БАН, ИР (5.2), диплома 001547 / 12.06.2023', date: '05.06.2023', total: 83, items: [
      { ind: 'Г7', title: 'Concept Model for Drone Selection in Specific Disaster Conditions', pts: 20 },
      { ind: 'Г7', title: 'A Fuzzy Logic Approach for Drone Capability Analysis on Disaster Risk Assessment', pts: 13.3 },
    ] },
    { kind: 'chief', label: 'Главен асистент — БАН, ИР (5.2), акт 1624 / 05.12.2023', date: '04.12.2023', total: 50, items: [] },
  ],
};

const chehlarova: Registry = {
  member: 'chehlarova', checked: '23.10.2026',
  publications: [
    { no: 23, year: 2025, title: '3D printed educational resources for studying percentages by people with visual impairments', venue: 'E-journal “Pedagogical forum”, DIITT, Trakia University, Iss. 2, pp. 97–106, ISSN 1314-7986, DOI 10.15547/PF.2025.015 (ERIH Plus)', site: '3D printed educational resources for studying percentages' },
    { no: 22, year: 2025, title: '3D printed models of fractions for people with visual impairments', venue: 'Е-списание „Стопанско управление“, Бр. 1, с. 51–59, ISSN 2738-7399 (НАЦИД)', site: '3D printed models of fractions' },
    { no: 21, year: 2025, title: 'Bibliometric analysis of documents in SCOPUS, researching 3D printing, in the field of engineering', venue: 'Applied Researches in Technics, Technologies and Education (ARTTE), Trakia University, Vol. 13, No. 1, pp. 12–19, ISSN 1314-8788, DOI 10.15547/artte.2025.01.002 (ERIH Plus)', site: 'Bibliometric analysis of documents in SCOPUS, researching 3D printing' },
    { no: 20, year: 2025, title: 'STEAM workshops with a 3D pen', venue: 'E-journal “Pedagogical forum”, DIITT, Trakia University, Iss. 1, pp. 41–49, ISSN 1314-7986, DOI 10.15547/PF.2025.004 (ERIH Plus)', coauthors: 'Chehlarova, K., Gecheva, N.', site: 'STEAM workshops with a 3D pen' },
    { no: 19, year: 2025, title: 'Bibliometric analysis of documents in Scopus, in the field of additive manufacturing', venue: 'Complex Control Systems, pp. 1–7, ISSN 2603-4697', site: 'Bibliometric analysis of documents in Scopus, in the field of additive' },
    { no: 18, year: 2025, title: 'Educational resources for studying midsegment of triangle and trapezoid', venue: 'Mathematics and Informatics, Az-buki, Vol. 1, pp. 51–62, ISSN 1310-2230, DOI 10.53656/math2025-1-4-edu', index: 'JCR-IF (Web of Science): 0.2, Q4', coauthors: 'Chehlarova, T., Gachev, G.', site: 'Educational resources for studying midsegment' },
    { no: 17, year: 2025, title: 'Math Lesson on counting 3D printed geometric shapes in an inclusive class', venue: 'ICL 2024, Lecture Notes in Networks and Systems 1281, Springer, pp. 335–344, ISSN 2367-3370, DOI 10.1007/978-3-031-83520-9_32', index: 'SJR (Scopus): 0.166, Q4', coauthors: 'Dimitrova, M., Bogdanova, G., Krastev, A., Sabev, N., Noev, N.', site: 'Math Lesson on Counting 3D Printed' },
    { no: 16, year: 2025, title: 'Адитивни технологии в образованието', venue: 'Изд. ДИПКУ, Тракийски университет, 184 с., ISBN 978-954-691-112-4 (печат), ISBN 978-954-691-113-1 (онлайн); рецензенти проф. д-р Иван Чавдаров, доц. д-р Даниела Кожухарова (монография)' },
    { no: 15, year: 2024, title: 'Management approaches and application areas of information security in organizations', venue: 'ETR 2024, Vol. 2, pp. 110–113, ISSN 1691-5402, DOI 10.17770/etr2024vol2.8062 (Scopus)', coauthors: 'Gaidarski, I.', site: 'Management approaches and application areas' },
    { no: 14, year: 2024, title: 'Изследване на пирамиди с равни ръбове, които имат равни радиуси на описаната около основата им окръжност', venue: 'Е-списание „Педагогически форум“, ДИПКУ, бр. 4, с. 101–108, ISSN 1314-7986, DOI 10.15547/PF.2024.028 (ERIH Plus)', coauthors: 'Чехларова, Т.' },
    { no: 13, year: 2024, title: 'Didactic resources for counting rectangular trapezoids', venue: 'E-journal “Pedagogical forum”, DIITT, Trakia University, Iss. 3, pp. 59–66, ISSN 1314-7986, DOI 10.15547/PF.2024.019 (ERIH Plus)', site: 'Didactic resources for counting rectangular trapezoids' },
    { no: 12, year: 2024, title: 'Application of 3D printed models for counting prisms in solids', venue: 'ARTTE, Vol. 12, No. 3, pp. 169–175, ISSN 1314-8788, DOI 10.15547/artte.2024.03.006 (ERIH Plus)', coauthors: 'Gachev, G.', site: 'Application of 3D printed models for counting prisms' },
    { no: 11, year: 2024, title: 'Counting triangles with 3D printed didactic materials for people with visual Impairment', venue: 'MIS4TEL 2024, Lecture Notes in Networks and Systems 1171, Springer, pp. 221–230, ISSN 2367-3370, DOI 10.1007/978-3-031-73538-7_20', index: 'Web of Science; SJR (Scopus): 0.166, Q4', coauthors: 'Bogdanova, G., Noev, N., Dimitrova, M.', site: 'Counting Triangles with 3D Printed' },
    { no: 10, year: 2024, title: 'Didactic materials for counting isosceles trapezoids by visually impaired people', venue: 'Symmetry: Culture and Science, Vol. 35, Num. 4, pp. 407–416, ISSN 0865-4824, DOI 10.26830/symmetry_2024_4_407', index: 'SJR (Scopus): 0.131; JCR-IF (Web of Science): 0.2, Q2', site: 'Didactic materials for counting isosceles' },
    { no: 9, year: 2023, title: 'Figures with an axis of symmetry with Photon Robot', venue: 'Symmetry: Culture and Science, Vol. 34, Num. 3, pp. 333–346, ISSN 0865-4824, DOI 10.26830/symmetry_2023_3_333', index: 'SJR (Scopus): 0.193; JCR-IF (Web of Science): 0.1, Q2', coauthors: 'Gachev, G.', site: 'Figures with an axis of symmetry' },
    { no: 8, year: 2022, title: 'Кратко обучение за работа с електронен подпис', venue: 'Българско електронно научно списание „Стопанско управление“, Бр. 1, с. 35–45, ISSN 2738-7399', site: 'Кратко обучение за работа с електронен подпис' },
    { no: 7, year: 2021, title: 'Axes of symmetry dominoes', venue: 'Symmetry: Culture and Science, Vol. 32, Num. 1, pp. 103–111, ISSN 0865-4824, DOI 10.26830/symmetry_2021_1_103', index: 'Scopus & WoS' },
    { no: 6, year: 2021, title: 'Computer model for self-preparation for playing with dominoes “Axes of symmetry”', venue: 'Symmetry: Culture and Science, Vol. 32, Num. 2, pp. 281–284, ISSN 0865-4824, DOI 10.26830/symmetry_2021_2_281', index: 'Scopus & WoS', coauthors: 'Chehlarova, T.', site: 'Computer model for self-preparation' },
    { no: 5, year: 2021, title: 'Кратки обучения за използване на QR код', venue: 'Е-списание „Педагогически форум“, Бр. 4, с. 22–29, ISSN 1314-7986, DOI 10.15547/PF.2021.022' },
    { no: 4, year: 2021, title: 'Подходи за формиране на дигитални компетенции в рамките на образователния процес, провеждан от висшите училища в Република България в професионално направление „Администрация и управление“', venue: 'Списание „Управление и устойчиво развитие“, 90 (5), с. 1–7, ISSN 1311-4506', coauthors: 'Милчев, Р.', site: 'Подходи за формиране на дигитални компетенции' },
    { no: 3, year: 2021, title: 'Digital competencies of public administration employees related to cybersecurity', venue: '12th National Conference with International Participation (ELECTRONICA), pp. 1–4, art. no. 9513705, ISBN 978-166544061-5, DOI 10.1109/ELECTRONICA52725.2021.9513705', index: 'Scopus', coauthors: 'Tsochev, G., Kotseva, M., Miltchev, R.', site: 'Digital competencies of public administration employees' },
    { no: 2, year: 2021, title: 'Първа седмица дистанционно обучение в СУ „Иван Вазов“ в Стара Загора', venue: 'Стратегии на образователната и научната политика, 29(2), с. 198–212, ISSN 1314-8575 (онлайн), ISSN 1310-0270 (печат), DOI 10.53656/str2021-2-6-dist', index: 'Web of Science', coauthors: 'Чехларова, Т., Цветкова, Д.', site: 'Първа седмица дистанционно обучение' },
    { no: 1, year: 2020, title: 'Development of digital competencies and skills in the field of use of cloud services and electronic communication', venue: 'Science, Engineering & Education, Vol. 5, Iss. 1, pp. 41–50, ISSN 2534-8515', coauthors: 'Miltchev, R.', site: 'Development of Digital Competencies and Skills in the Field of Use of Cloud' },
  ],
  procedures: [
    { kind: 'phd', label: 'ОНС „доктор“ — Лесотехнически университет (3.7), диплома ЛТУ-ОНС-2023-166 / 23.05.2023', date: '30.01.2023', total: 80, items: [
      { ind: 'Г', title: 'Кратко обучение за работа с електронен подпис', pts: 10 },
      { ind: 'Г', title: 'Кратки обучения за използване на QR код', pts: 10 },
      { ind: 'Г', title: 'Подходи за формиране на дигитални компетенции', pts: 5 },
      { ind: 'Г', title: 'Development of digital competencies and skills in the field of use of cloud services', pts: 5 },
    ] },
    { kind: 'chief', label: 'Главен асистент — БАН, ИР (5.2), акт 1221 / 23.06.2023', date: '23.06.2023', total: 50, items: [] },
    { kind: 'assoc', label: 'Доцент — БАН, ИР (5.2), акт 679 / 16.10.2025', date: '16.10.2025', total: 437, items: [
      { ind: 'В3', title: 'Адитивни технологии в образованието', pts: 100 },
      { ind: 'Г7', title: 'Educational resources for studying midsegment of triangle and trapezoid', pts: 13.3 },
      { ind: 'Г7', title: 'Math Lesson on counting 3D printed geometric shapes in an inclusive class', pts: 6.7 },
      { ind: 'Г7', title: 'Counting triangles with 3D printed didactic materials for people with visual Impairment', pts: 10 },
      { ind: 'Г7', title: 'Didactic materials for counting isosceles trapezoids by visually impaired people', pts: 40 },
      { ind: 'Г7', title: 'Figures with an axis of symmetry with Photon Robot', pts: 20 },
      { ind: 'Г8', title: '3D printed educational resources for studying percentages by people with visual impairments', pts: 20 },
      { ind: 'Г8', title: '3D printed models of fractions for people with visual impairments', pts: 20 },
      { ind: 'Г8', title: 'Bibliometric analysis of documents in SCOPUS, researching 3D printing, in the field of engineering', pts: 20 },
      { ind: 'Г8', title: 'STEAM workshops with a 3D pen', pts: 6.7 },
      { ind: 'Г8', title: 'Bibliometric analysis of documents in Scopus, in the field of additive manufacturing', pts: 20 },
      { ind: 'Г8', title: 'Изследване на пирамиди с равни ръбове', pts: 10 },
      { ind: 'Г8', title: 'Didactic resources for counting rectangular trapezoids', pts: 20 },
      { ind: 'Г8', title: 'Application of 3D printed models for counting prisms in solids', pts: 10 },
    ], citations: [
      { cited: 'Management approaches and application areas of information security in organizations', citing: 'Organizational communication: Analysis of research trends through production indicators in Scopus', pts: 10 },
      { cited: 'Axes of symmetry dominoes', citing: 'On integration of STEM modules in mathematics education', pts: 10 },
      { cited: 'Axes of symmetry dominoes', citing: 'Israeli math teachers’ view on integration of STEM modules', pts: 10 },
      { cited: 'Axes of symmetry dominoes', citing: 'За природата на математиката и за математиката в природата', pts: 10 },
      { cited: 'Computer model for self-preparation for playing with dominoes', citing: 'Програмна реализация на играта „Комбинация девет“', pts: 10 },
      { cited: 'Digital competencies of public administration employees related to cybersecurity', citing: 'Group Decision-Making Involving Competence of Experts in Relation to Evaluation Criteria', pts: 10 },
      { cited: 'Digital competencies of public administration employees related to cybersecurity', citing: 'Exposing the Phish: The Effect of Persuasion Techniques in Phishing E-Mails', pts: 10 },
    ] },
  ],
};

export const nacidRegistry: Record<string, Registry> = { gaidarski, hristozov, chehlarova };

/** Нормализиране за сравнение на заглавия */
export const tkey = (t: string) => String(t ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^0-9a-zа-я]+/gi, ' ').trim();
/** Процедурите, чиито доказателства не се ползват за целевата длъжност (ППЗРАСРБ, Приложение, т. 8): 3 = доцент, 4 = професор */
export const excludedKinds = (target: number | null): ProcKind[] => (target === 4 || target === null ? ['phd', 'dsc', 'assoc'] : target === 3 ? ['phd', 'dsc'] : []);
