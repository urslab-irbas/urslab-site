// Публикации 2022 – 2024 г. (от стария PDF https://ir.bas.bg/labs/brs/publ1.pdf).
// Всяка публикация е на страницата за годината си: 2025 → archive2025.ts, преди 2022 → archiveEarlier.ts.
// Тук са и общите типове, категории и етикети за всички годишни страници (archive2025.ts, archive2026.ts…).
// Пренесени са от PDF-а; при съмнение — сверете с оригиналната публикация.
//
// cat:  mono  — монография            book — учебник / учебно помагало
//       q1…q4 — WoS/Scopus с квартил  sjr  — със SJR, без квартил
//       idx   — WoS/Scopus/IEEE Xplore без JCR и SJR
//       other — в други бази данни
// sjr / jif — SJR (Scopus) и импакт фактор (JCR, Web of Science), ако има.
// team — ключове на членовете на колектива сред авторите (src/data/team/*), за филтъра „По автор“.
// tags — етикети по тема (archiveTagLabels по-долу); те свързват и с „Научни направления“.
// title — на езика на публикацията; tr — превод на заглавието (показва се на английската страница).

export type ArchCat = 'mono' | 'book' | 'q1' | 'q2' | 'q3' | 'q4' | 'sjr' | 'idx' | 'erih' | 'intl' | 'nat' | 'nrs' | 'other' | 'soft' | 'sub';

export interface ArchivePub {
  year: number;
  /** само за непубликувани (cat 'sub'): под печат или подадена */
  st?: 'in-press' | 'submitted';
  /** резюме (само за въведените през формата) */
  abstract?: string;
  authors: string;
  title: string;
  tr?: string;
  venue: string;
  doi?: string;
  isbn?: string;
  issn?: string;
  url?: string;    // връзка към публикацията, ако няма DOI
  eid?: string;    // Scopus EID
  cat: ArchCat;
  sjr?: number;
  jif?: number;
  team: string[];
  tags: string[];
  ix?: boolean;    // индексирана в WoS/Scopus, макар че категорията ѝ в отчета е друга
  share?: number;  // „Процент автори от звеното“ (ИР) от отчета на БАН
  note?: string;   // бележка от отчета, напр. „Друга база (не влиза в К2)“
}

export const archiveCats: { key: ArchCat; label: { bg: string; en: string } }[] = [
  { key: 'q1', label: { bg: 'Q1', en: 'Q1' } },
  { key: 'q2', label: { bg: 'Q2', en: 'Q2' } },
  { key: 'q3', label: { bg: 'Q3', en: 'Q3' } },
  { key: 'q4', label: { bg: 'Q4', en: 'Q4' } },
  { key: 'sjr', label: { bg: 'SJR без квартил', en: 'SJR, no quartile' } },
  { key: 'idx', label: { bg: 'WoS/Scopus без JCR/SJR', en: 'WoS/Scopus, no JCR/SJR' } },
  { key: 'erih', label: { bg: 'ERIH+', en: 'ERIH+' } },
  { key: 'intl', label: { bg: 'Международно академично издателство', en: 'International academic publisher' } },
  { key: 'nat', label: { bg: 'Национално академично издателство', en: 'National academic publisher' } },
  { key: 'nrs', label: { bg: 'Национален референтен списък (НАЦИД)', en: 'National Reference List (NACID)' } },
  { key: 'other', label: { bg: 'Други бази данни', en: 'Other databases' } },
  { key: 'mono', label: { bg: 'Монографии', en: 'Monographs' } },
  { key: 'book', label: { bg: 'Учебници', en: 'Textbooks' } },
  { key: 'soft', label: { bg: 'Софтуер (Zenodo)', en: 'Software (Zenodo)' } },
  { key: 'sub', label: { bg: 'Подадени / под печат', en: 'Submitted / in press' } },
];

export const archiveTagLabels: Record<string, { bg: string; en: string }> = {
  navigation: { bg: 'Навигация', en: 'Navigation' },
  ins: { bg: 'INS/GNSS', en: 'INS/GNSS' },
  geodesy: { bg: 'Геодезия', en: 'Geodesy' },
  gravity: { bg: 'Гравитация', en: 'Gravity' },
  avionics: { bg: 'Авионика', en: 'Avionics' },
  software: { bg: 'Софтуер', en: 'Software' },
  uas: { bg: 'БЛС', en: 'UAS' },
  sora: { bg: 'Безопасност на полетите (SORA)', en: 'Flight safety (SORA)' },
  wsn: { bg: 'Безжични мрежи и комуникации', en: 'Wireless networks & communications' },
  radar: { bg: 'Радари', en: 'Radar' },
  security: { bg: 'Сигурност', en: 'Security' },
  ai: { bg: 'Изкуствен интелект', en: 'Artificial intelligence' },
  robotics: { bg: 'Роботика', en: 'Robotics' },
  hri: { bg: 'Взаимодействие човек–робот', en: 'Human–robot interaction' },
  education: { bg: 'Образование', en: 'Education' },
  accessibility: { bg: 'Достъпност', en: 'Accessibility' },
  additive: { bg: '3D печат', en: '3D printing' },
};

export const archive: ArchivePub[] = [
  {
    year: 2023, cat: 'mono', team: ['aleksandrov'], tags: ['wsn'],
    authors: 'Aleksandrov, A.',
    title: 'Безжични сензорни системи. Архитектура и комуникационни протоколи',
    tr: 'Wireless Sensor Systems. Architecture and Communication Protocols',
    venue: 'Академично издателство „За буквите – О писменехь“, УНИБИТ, София, 270 с.',
    isbn: '978-619-185-636-7',
  },
  {
    year: 2023, cat: 'mono', team: ['chehlarova'], tags: ['education'],
    authors: 'Чехларова, Н.',
    title: 'Изследване на системата за е-бизнес в контекста на повишаване на дигиталната компетентност на потребителите',
    tr: 'Investigation of the e-business system in the context of enhancing users’ digital competence',
    venue: 'Тонедико, 170 с.',
    isbn: '978-619-91492-8-7',
  },
  {
    year: 2023, cat: 'q1', sjr: 0.8, jif: 3.847, team: ['yovchev'], tags: ['robotics'],
    authors: 'Chavdarov, I., Yovchev, K., Miteva, L., Stefanov, A., Nedanovski, D.',
    title: 'A strategy for controlling motions related to sensory information in a walking robot Big Foot',
    venue: 'Sensors 23(3), MDPI', doi: '10.3390/s23031506',
  },
  {
    year: 2024, cat: 'q2', sjr: 0.703, jif: 2.4, team: ['chehlarova'], tags: ['accessibility', 'education'],
    authors: 'Bogdanova, G., Todorov, T., Noev, N., Sabev, N., Chehlarova, N., Todorova-Ekmekci, M., Krastev, A.',
    title: 'An ecosystem for the provision of digital accessibility for people with special needs',
    venue: 'Information 15(6), MDPI, pp. 1–11', doi: '10.3390/info15060315',
  },
  {
    year: 2024, cat: 'q2', sjr: 0.189, jif: 0.2, team: ['chehlarova'], tags: ['accessibility', 'education'],
    authors: 'Chehlarova, N.',
    title: 'Didactic materials for counting isosceles trapezoids by visually impaired people',
    venue: 'Symmetry: Culture and Science 35(4), Symmetrion, pp. 407–416', doi: '10.26830/symmetry_2024_4_407',
  },
  {
    year: 2024, cat: 'q2', sjr: 0.809, jif: 3, team: ['chehlarova', 'madzharov'], tags: ['hri', 'robotics'],
    authors: 'Dimitrova, M., Chehlarova, N., Madzharov, A., Krastev, A., Chavdarov, I.',
    title: 'Psychophysics of user acceptance of social cyber-physical systems',
    venue: 'Frontiers in Robotics and AI, Section Human-Robot Interaction 11, Frontiers Media, pp. 1–8', doi: '10.3389/frobt.2024.1414853',
  },
  {
    year: 2023, cat: 'q2', sjr: 0.193, jif: 0.1, team: ['chehlarova'], tags: ['education', 'robotics'],
    authors: 'Chehlarova, N., Gachev, G.',
    title: 'Figures with an axis of symmetry with Photon Robot',
    venue: 'Symmetry: Culture and Science 34(3), Symmetrion, pp. 333–346', doi: '10.26830/symmetry_2023_3_333',
  },
  {
    year: 2024, cat: 'q4', sjr: 0.253, team: ['chehlarova', 'madzharov'], tags: ['hri', 'education', 'robotics'],
    authors: 'Dimitrova, M., Kostova, S., Chavdarov, I., Krastev, A., Chehlarova, N., Madzharov, A.',
    title: 'Psychosocial and Psychophysical Aspects of the Interaction with Humanoid Robots: Implications for Education',
    venue: 'CompSysTech ’24: International Conference on Computer Systems and Technologies 2024, Ruse, Bulgaria, June 2024, ACM International Conference Proceeding Series, pp. 1–9', doi: '10.1145/3674912.3674951',
    isbn: '979-8-4007-1684-3',
  },
  {
    year: 2024, cat: 'q4', sjr: 0.171, team: ['chehlarova'], tags: ['accessibility', 'education'],
    authors: 'Chehlarova, N., Bogdanova, G., Noev, N., Dimitrova, M.',
    title: 'Counting Triangles with 3D Printed Didactic Materials for People with Visual Impairment',
    venue: 'MIS4TEL 2024, Lecture Notes in Networks and Systems 1171, Springer, pp. 221–230', doi: '10.1007/978-3-031-73538-7_20',
  },
  {
    year: 2022, cat: 'q4', sjr: 0.232, team: ['yovchev'], tags: ['robotics'],
    authors: 'Yovchev, K., Miteva, L.',
    title: 'Real-time Trajectory Replanning for Dynamic Obstacles Avoidance for Robotics Manipulators',
    venue: 'CompSysTech 2022, ACM International Conference Proceeding Series, pp. 45–50', doi: '10.1145/3546118.3546135',
  },
  {
    year: 2022, cat: 'q4', sjr: 0.15, team: ['gaidarski'], tags: ['security'],
    authors: 'Gaidarski, I., Kutinchev, P.',
    title: 'An approach for constructing a simulation model for dynamic analysis of Information Security System',
    venue: 'Lecture Notes in Networks and Systems 418, Springer, pp. 518–526', doi: '10.1007/978-3-030-96308-8',
  },
  {
    year: 2022, cat: 'q4', sjr: 0.232, team: ['yovchev'], tags: ['robotics'],
    authors: 'Miteva, L., Yovchev, K., Chavdarov, I.',
    title: 'Planning Orientation Change of the End-effector of State Space Constrained Redundant Robotic Manipulators',
    venue: 'CompSysTech 2022, ACM International Conference Proceeding Series, pp. 51–56', doi: '10.1145/3546118.3546136',
  },
  {
    year: 2024, cat: 'q4', sjr: 0.167, team: ['hristozov'], tags: ['sora', 'uas'],
    authors: 'Stanev, H., Hristozov, S.',
    title: 'Applicability of JARUS SORA to State UAS Operations in Disaster Relief',
    venue: 'Environment. Technology. Resources. Proc. 15th Int. Conf., vol. 4, pp. 244–250', doi: '10.17770/etr2024vol4.8195',
  },
  {
    year: 2024, cat: 'q4', sjr: 0.167, team: ['gaidarski', 'chehlarova'], tags: ['security'],
    authors: 'Gaidarski, I., Chehlarova, N.',
    title: 'Management approaches and application areas of information security in organizations',
    venue: 'Environment. Technology. Resources. Proc. 15th Int. Conf., vol. II, Rezekne Academy of Technologies, pp. 110–113',
  },
  {
    year: 2024, cat: 'q4', sjr: 0.167, team: ['madzharov', 'chehlarova'], tags: ['security', 'education'],
    authors: 'Yoshinov, R., Kotseva, M., Madzharov, A., Chehlarova, N.',
    title: 'Implying cybersecurity skills for public administration employees',
    venue: 'Environment. Technology. Resources. ETR 2024, vol. 4, pp. 300–304', doi: '10.17770/etr2024vol4.8238',
  },
  {
    year: 2024, cat: 'q4', sjr: 0.167, team: ['madzharov', 'chehlarova'], tags: ['ai', 'education'],
    authors: 'Yoshinov, R., Kotseva, M., Madzharov, A., Chehlarova, N.',
    title: 'Skills and attitudes towards using AI based chatbots',
    venue: 'Environment. Technology. Resources. ETR 2024, vol. 2, pp. 138–142', doi: '10.17770/etr2024vol2.8064',
  },
  {
    year: 2024, cat: 'q4', sjr: 0.166, team: ['aleksandrov'], tags: ['wsn', 'security'],
    authors: 'Alexandrov, A.',
    title: 'Reducing the WSN’s communication overhead by the SD-SPDZ encryption protocol',
    venue: 'BISEC 2023, CEUR-WS Vol-3676, pp. 50–57', doi: '10.5281/zenodo.11196843',
  },
  {
    year: 2024, cat: 'q4', sjr: 0.166, team: ['aleksandrov', 'madzharov'], tags: ['wsn', 'uas', 'security'],
    authors: 'Alexandrov, A., Madzharov, A.',
    title: 'Energy-efficient routing in UAVs supported perimeter security networks',
    venue: 'BISEC 2023, CEUR-WS Vol-3676, pp. 44–49', doi: '10.5281/zenodo.11396636',
  },
  {
    year: 2024, cat: 'q4', sjr: 0.153, team: ['yovchev'], tags: ['robotics'],
    authors: 'Yovchev, K., Miteva, L., Chikurtev, D.',
    title: 'Algorithm for Assigning a Robot to Capture an Object From a Production Pipeline',
    venue: 'AIP Conference Proceedings 2980(1), 020006', doi: '10.1063/5.0184210',
  },
  {
    year: 2024, cat: 'sjr', sjr: 0.25, team: ['yovchev'], tags: ['ai', 'robotics'],
    authors: 'Yovchev, K., Miteva, L.',
    title: 'Approaches for Object Detection and Depth Estimation in Digital Images',
    venue: 'CompSysTech 2024, ACM International Conference Proceeding Series', doi: '10.1145/3674912.3674932',
  },
  {
    year: 2024, cat: 'idx', team: ['chehlarova'], tags: ['accessibility', 'education'],
    authors: 'Bogdanova, G., Todorov, T., Noev, N., Tomov, Zh., Chehlarova, N.',
    title: 'Model of computer game at education of visually impaired people',
    venue: 'IEEE ITHET 2024, pp. 1–7', doi: '10.1109/ITHET61869.2024.10837626',
  },
  {
    year: 2024, cat: 'idx', team: ['gaidarski'], tags: ['security', 'education'],
    authors: 'Gaidarski, I., Djambazova, E., Terzieva, V., Ilchev, S.',
    title: 'Aspects of Dependability and Security in Integrated Intelligent Educational Environments',
    venue: '2024 IEEE 12th International Conference on Intelligent Systems (IS), pp. 1–6', doi: '10.1109/IS61756.2024.10705223',
  },
  {
    year: 2024, cat: 'idx', team: ['yovchev'], tags: ['robotics', 'education'],
    authors: 'Chavdarov, I., Yovchev, K., Naydenov, B., Hrosinkov, V.',
    title: '3D Printed DELTA Robot for Educational Purposes',
    venue: 'SoftCOM 2024, IEEE, pp. 1–6', doi: '10.23919/SoftCOM62040.2024.10721779',
  },
  {
    year: 2024, cat: 'idx', team: ['chehlarova', 'madzharov'], tags: ['hri', 'robotics'],
    authors: 'Dimitrova, M., Chehlarova, N., Madzharov, A., Krastev, A.',
    title: 'A Psychophysical View on User Acceptance of Robotic Systems for Social Applications',
    venue: '2024 21st International Conference on Information Technology Based Higher Education and Training (ITHET) with IEETeL 2024 Workshop, IEEE, November 2024, pp. 1–6', doi: '10.1109/ITHET61869.2024.10837594',
  },
  {
    year: 2023, cat: 'idx', team: ['gaidarski'], tags: ['security'],
    authors: 'Gaidarski, I.',
    title: 'Aplication of UML descriptive modeling techniques in Model Driven Engineering of Information Security System',
    venue: 'BdKCSE’2023, IEEE, pp. 1–5', doi: '10.1109/BdKCSE59280.2023.10339781',
  },
  {
    year: 2022, cat: 'idx', team: ['yovchev'], tags: ['robotics'],
    authors: 'Chavdarov, I., Naydenov, B., Yovchev, K., Miteva, L.',
    title: 'Topology optimization of an assembled 3D printed robot',
    venue: 'SoftCOM 2022, IEEE', doi: '10.23919/SoftCOM55329.2022.9911410',
  },
  {
    year: 2022, cat: 'idx', team: ['yovchev'], tags: ['robotics'],
    authors: 'Miteva, L., Yovchev, K., Chikurtev, D.',
    title: 'Software and Hardware Infrastructure for Research and Development of Intelligent Control for Robotic Manipulators',
    venue: '2022 XXXI International Scientific Conference Electronics (ET), IEEE', doi: '10.1109/ET55967.2022.9920270',
  },
  {
    year: 2024, cat: 'other', team: ['aleksandrov'], tags: ['wsn'],
    authors: 'Alexandrov, A.',
    title: 'Design and Architecture of wireless ECG monitoring system',
    venue: 'Int. Conf. “Robotics & Mechatronics 2024”, Sofia', doi: '10.5281/zenodo.14074924',
  },
  {
    year: 2024, cat: 'other', team: ['chehlarova'], tags: ['education', 'accessibility'],
    authors: 'Chehlarova, N.',
    title: 'Didactic resources for counting rectangular trapezoids',
    venue: 'Pedagogical Forum 3, Trakia University, pp. 59–66', doi: '10.15547/PF.2024.019',
  },
  {
    year: 2024, cat: 'other', team: ['chehlarova'], tags: ['education'],
    authors: 'Chehlarova, N., Gachev, G.',
    title: 'Application of 3D printed models for counting prisms in solids',
    venue: 'ARTTE 12(3), Trakia University, pp. 169–175', doi: '10.15547/artte.2024.03.006',
  },
  {
    year: 2024, cat: 'other', team: ['chehlarova'], tags: ['education', 'robotics'],
    authors: 'Chehlarova, N., Gecheva, N., Chehlarova, K.',
    title: 'Construction of types of quadrilaterals with a six-legged educational robot',
    venue: 'Innovative STEM Education 6, IMI-BAS, pp. 76–84', doi: '10.55630/STEM.2024.0607',
  },
  {
    year: 2024, cat: 'other', team: ['chehlarova'], tags: ['education'],
    authors: 'Chehlarova, K., Chehlarova, N., Gachev, G.',
    title: '360-degree photos in the Virtual Mathematics Laboratoty',
    venue: 'ARTTE 12(3), Trakia University, pp. 163–168', doi: '10.15547/artte.2024.03.005',
  },
  {
    year: 2024, cat: 'other', team: ['chehlarova'], tags: ['education'],
    authors: 'Chehlarova, T., Chehlarova, K., Chehlarova, N.',
    title: 'Snowflake in the context of STEAM education or overcoming a misconception',
    venue: 'Innovative STEM Education 6, IMI-BAS, pp. 64–75', doi: '10.55630/STEM.2024.0606',
  },
  {
    year: 2024, cat: 'other', team: ['gaidarski'], tags: ['security'],
    authors: 'Gaidarski, I.',
    title: 'Some aspects of cybersecurity in Industry 4.0',
    venue: 'Complex Control Systems 7, IR-BAS',
  },
  {
    year: 2024, cat: 'other', team: ['gaidarski', 'madzharov'], tags: ['security'],
    authors: 'Gaidarski, I., Madzharov, A.',
    title: 'Applying a New Approach to Consider the Human Factor in the Design of Information Security Systems',
    venue: 'Information & Security: An International Journal 55(3), Procon, pp. 261–272', doi: '10.11610/isij.5546',
  },
  {
    year: 2024, cat: 'other', team: ['madzharov', 'georgiev', 'hristozov'], tags: ['uas', 'security'],
    authors: 'Madzharov, A., Georgiev, R., Hristozov, S.',
    title: 'Blockchain enhancing IoD network functionality',
    venue: 'Complex Control Systems 8, IR-BAS',
  },
  {
    year: 2024, cat: 'other', team: ['madzharov', 'hristozov', 'chehlarova', 'georgiev', 'gaidarski', 'aleksandrov'], tags: ['uas', 'navigation'],
    authors: 'Madzharov, A., Hristozov, S., Chehlarova, N., Georgiev, R., Gaidarski, I., Alexandrov, A.',
    title: 'Design of an Unmanned Helicopter System for Collecting and Processing of Geographical Information',
    venue: 'Complex Control Systems 7, IR-BAS',
  },
  {
    year: 2024, cat: 'other', team: ['hristozov', 'madzharov', 'chehlarova'], tags: ['uas', 'navigation'],
    authors: 'Hristozov, S., Madzharov, A., Chehlarova, N.',
    title: 'Design of a testing model for evaluation the levels of automation and autonomy of a helicopter autopilot',
    venue: 'Complex Control Systems 7, IR-BAS',
  },
  {
    year: 2024, cat: 'other', team: ['chehlarova'], tags: ['education'],
    authors: 'Чехларова, К., Чехларова, Н.',
    title: 'STEАM работилници по проект „Стъклен инициал“',
    tr: 'STEAM workshops under the project “Glass Initial”',
    venue: 'Педагогически форум 3, Тракийски университет, с. 31–41',
  },
  {
    year: 2024, cat: 'other', team: ['chehlarova'], tags: ['education'],
    authors: 'Чехларова, Т., Чехларова, Н.',
    title: 'Изследване на пирамиди с равни ръбове, които имат равни радиуси на описаната около основата им окръжност',
    tr: 'Investigation of pyramids with equal edges having equal radii of the circle circumscribed about the base',
    venue: 'Педагогически форум 4, Тракийски университет, с. 101–108', doi: '10.15547/PF.2024.028',
  },
  {
    year: 2023, cat: 'other', team: ['aleksandrov', 'madzharov'], tags: ['uas', 'wsn'],
    authors: 'Alexandrov, A., Madzharov, A.',
    title: 'Trajectory optimization in large scale UAV-assisted WSNs',
    venue: 'Complex Control Systems, IR-BAS', doi: '10.5281/zenodo.10684996',
  },
  {
    year: 2023, cat: 'other', team: ['aleksandrov', 'madzharov'], tags: ['security', 'wsn'],
    authors: 'Alexandrov, A., Madzharov, A.',
    title: 'Design of marine underwater perimeter security system',
    venue: 'Институт по отбрана „Проф. Цветан Лазаров“, pp. II-36–II-43',
  },
  {
    year: 2023, cat: 'other', team: ['chehlarova'], tags: ['education', 'robotics'],
    authors: 'Chehlarova, N.',
    title: 'Management of a dance with Photon Robot',
    venue: 'Int. Conf. “Robotics & Mechatronics 2023”, Complex Control Systems',
  },
  {
    year: 2023, cat: 'other', team: ['gaidarski'], tags: ['security'],
    authors: 'Gaidarski, I., Kutinchev, P.',
    title: 'Some aspects of Information Security and Cybersecurity problem area',
    venue: 'Problems of Engineering Cybernetics and Robotics 79, BAS, pp. 55–66', doi: '10.7546/PECR.79.23.03',
  },
  {
    year: 2023, cat: 'other', team: ['gaidarski'], tags: ['security', 'robotics'],
    authors: 'Gaidarski, I., Kutinchev, P.',
    title: 'Modern Aspects in Information Security in the Field of Robotics',
    venue: 'Int. Conf. “Robotics & Mechatronics 2023”, Complex Control Systems',
  },
  {
    year: 2023, cat: 'other', team: [], tags: ['robotics'],
    authors: 'Ivanova, V., Boneva, A., Ivanov, S., Doshev, Y.',
    title: 'An ECG monitoring device for a modular instrument to surgical robots',
    venue: 'Automation of Discrete Production Engineering 5, TU-Sofia, pp. 44–50',
  },
  {
    year: 2023, cat: 'other', team: ['gaidarski'], tags: ['security'],
    authors: 'Гайдарски, И., Кутинчев, П.',
    title: 'Съвременни подходи за опазване на чувствителна информация',
    tr: 'Modern approaches to protecting sensitive information',
    venue: 'Сборник „Съвременни изследвания и технологии за отбраната“ (ARTDef), Институт по отбрана „Проф. Цветан Лазаров“',
  },
  {
    year: 2023, cat: 'other', team: ['chehlarova'], tags: ['education'],
    authors: 'Чехларова, Н.',
    title: 'Подкрепа при развитие на дигитална компетентност на потребителите',
    tr: 'Support in developing users’ digital competence',
    venue: 'Стопанско управление 1, с. 51–63',
  },
  {
    year: 2022, cat: 'other', team: ['gaidarski'], tags: ['security'],
    authors: 'Gaidarski, I.',
    title: 'Model Driven Development of Information Security System',
    venue: 'Problems of Engineering Cybernetics and Robotics 76, BAS, pp. 47–62', doi: '10.7546/PECR.76.21.04',
  },
  {
    year: 2022, cat: 'other', team: ['gaidarski'], tags: ['security'],
    authors: 'Gaidarski, I., Kutinchev, P.',
    title: 'Transformation of UML Design Models of Information Security System into Agent-based Simulation Models',
    venue: 'Information & Security: An International Journal 53(1), Procon, pp. 65–77', doi: '10.11610/isij.5305',
  },
  {
    year: 2022, cat: 'other', team: ['chehlarova'], tags: ['security', 'education'],
    authors: 'Чехларова, Н.',
    title: 'Кратко обучение за работа с електронен подпис',
    tr: 'Brief training on working with an electronic signature',
    venue: 'Стопанско управление 1, с. 35–45',
  },
];
