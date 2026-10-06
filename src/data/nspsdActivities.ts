// ННП „Сигурност и отбрана“ — докторанти и конференции/семинари на работните екипи в ИР-БАН.
// Страници: /projects/nspsd/phd/ и /projects/nspsd/events/ (бутони в картата на проекта). Разделите следват
// сайта на програмата: https://nsp.secade.bg/bg/rezultati/obuchenie и …/konferencii-i-seminari
// Източници: отчетите на ИР-БАН по ННП-СО (технически доклад до 31.12.2025 г.; отчет, ред. 17.04.2026 г.),
// дисертацията в НАЦИД и публикациите на сайта. Докладите (papers) са части от заглавия на публикации
// от сайта — линкът към тях се взима автоматично.
type L = { bg: string; en: string };

export const NSP_SITE = {
  phd: 'https://nsp.secade.bg/bg/rezultati/obuchenie#section-1',
  events1: 'https://nsp.secade.bg/bg/rezultati/konferencii-i-seminari#section-1',
  events2: 'https://nsp.secade.bg/bg/rezultati/konferencii-i-seminari#section-2',
};

// ---------- Докторанти по ННП СиО ----------
export const phd = {
  name: { bg: 'гл. ас. д-р Стефан Иванов Христозов', en: 'Chief Assist. Prof. Dr. Stefan Ivanov Hristozov' } as L,
  title: { bg: 'Оценка на риска при бедствия чрез използването на дистанционно-управляеми летателни системи', en: 'Disaster risk assessment using remotely piloted aircraft systems' } as L,
  titleNote: { bg: '', en: 'English translation of the Bulgarian title.' } as L,
  facts: [
    { k: { bg: 'Образователна и научна степен', en: 'Degree' }, v: { bg: 'ОНС „доктор“', en: 'PhD (educational and scientific degree “Doctor”)' } },
    { k: { bg: 'Професионално направление', en: 'Field' }, v: { bg: '5.2. Електротехника, електроника и автоматика', en: '5.2 Electrical Engineering, Electronics and Automation' } },
    { k: { bg: 'Научна организация', en: 'Institution' }, v: { bg: 'Институт по роботика „Св. Ап. и Ев. Матей“ — БАН', en: 'Institute of Robotics “St. Apostle and Gospeller Matthew” — Bulgarian Academy of Sciences' } },
    { k: { bg: 'Научен ръководител', en: 'Supervisor' }, v: { bg: 'проф. д-р Пламена Златева', en: 'Prof. Dr. Plamena Zlateva' } },
    { k: { bg: 'Консултант', en: 'Consultant' }, v: { bg: 'доц. д-р инж. Анастас Н. Маджаров', en: 'Assoc. Prof. Dr. Eng. Anastas N. Madzharov' } },
    { k: { bg: 'Дисертационен труд', en: 'Thesis' }, v: { bg: '31 март 2023 г.', en: '31 March 2023' } },
    { k: { bg: 'Диплома', en: 'Diploma' }, v: { bg: '№ 001547 / 12.06.2023 г.', en: 'No. 001547 / 12 June 2023' } },
    { k: { bg: 'Задачи по ННП-СО', en: 'NSP DS tasks' }, v: { bg: '1.1.2 и 1.2.1', en: '1.1.2 and 1.2.1' } },
  ] as { k: L; v: L }[],
  nacid: 'https://ras.nacid.bg/api/reg/FilesStorage?key=38031e55-cfb2-4975-b618-a2692f567e77&mimeType=application/pdf&fileName=11%202023-03-31%20-%20%D0%94%D0%B8%D1%81%D0%B5%D1%80%D1%82%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%20%D1%84%D0%B8%D0%BD%D0%B0%D0%BB.pdf&dbId=1',
  register: 'https://ras.nacid.bg/dissertation-preview/73057',
  // анотацията — дословно от дисертацията (Анотация / Annotation)
  annotation: {
    bg: [
      'Предпоставка за тази разработка е все по-широката употреба на безпилотни летателни системи (БЛС) от различни индустриални потребители и служби, свързани с реакцията и оценката на риск при бедствия. Това е нововъзникваща и бързоразвиваща се концепция.',
      'Целта е да се разгледат предизвикателствата пред осигуряването на безопасността при операции с БЛС и да се предложи аналитичен метод за анализ на рисковете, свързани с употребата им и отношението им към останалите участници на сцената на бедствието, като останат ползите им като алтернативно средство за събиране на информация в изпълнение на мисии при оценка на риска от бедствия.',
      'Получените резултати от аналитичния метод служат за организиране и провеждане на по-успешни и безопасни операции, улесняват изготвянето на оценка на риска от бедствия, съответно по-обективната оценка на щетите от нежеланите последствия. Направеният анализ и предложеният от автора алгоритъм дават метод за оценка на рисковете в една бързо развиваща се сфера на безпилотната авиация. Предлаганият модел е приложим към бъдеща система за обслужване и управление на движението на БЛС.',
    ],
    en: [
      'A prerequisite for this development is the increasingly widespread use of unmanned aerial systems (UAS) by various industrial users, as well as services related to disaster response and risk assessment. It is an emerging and rapidly developing concept.',
      'The aim is to examine the challenges of ensuring safety in UAS operations and to propose an analytical approach to analyse the risks associated with their use and their relationship to other participants in the disaster scene, while retaining their benefits as an alternative means of gathering information in disaster risk assessment missions.',
      'The results obtained from the analytical approach serve to organize and conduct more successful and safer operations and facilitate disaster risk assessment, respectively a more objective assessment of damage from unwanted consequences. The analysis, as well as the algorithm proposed by the author, provide a method for assessing risks in a rapidly developing field of unmanned aviation. The proposed model is applicable to a future UAS traffic management system.',
    ],
  } as { bg: string[]; en: string[] },
  ack: {
    bg: 'Дисертацията е финансирана от Министерството на образованието и науката в изпълнение на Национална научна програма „Сигурност и отбрана“, приета с РМС № 731 от 21.10.2021 г., и съгласно Споразумение № Д01-74/19.05.2022 г.',
    en: 'This work was supported by the NSP DS program, which has received funding from the Ministry of Education and Science of the Republic of Bulgaria under the grant agreement No. D01-74/19.05.2022.',
  } as L,
  chapters: [
    { bg: 'Анализ на предизвикателствата и приложенията на БЛС', en: 'Analysis of the challenges and applications of UAS' },
    { bg: 'Анализ на съществуващите модели за оценка на риска (Bowtie, HRM, JARUS SORA, SMS на ИКАО)', en: 'Analysis of existing risk assessment models (Bowtie, HRM, JARUS SORA, ICAO SMS)' },
    { bg: 'Разработване на аналитичен метод за оценка на риска (Байесова мрежа, модел с размита логика, избор на БЛС в специфични условия)', en: 'Development of an analytical risk assessment method (Bayesian network, fuzzy-logic model, UAS selection for specific conditions)' },
    { bg: 'Анализ на отговорността и внедряване на модела', en: 'Accountability analysis and implementation of the model' },
  ] as L[],
  // свързани публикации по програмата (части от заглавия на сайта)
  papers: [
    'Applicability of JARUS SORA to State UAS Operations in Disaster Relief',
    'A Parametric Comparison of JARUS SORA 2.0 and 2.5',
    'Improvement in U-Space Development by Civil-Military Cooperation',
    'Design of a testing model for evaluation the levels of automation',
  ],
};

// ---------- Конференции и семинари ----------
export interface NspEvent {
  title: L;
  date?: L;          // липсва → „предстои да се допълни“
  place?: L;
  form?: L;
  url?: string;
  people?: L;        // участници от ИР-БАН
  text?: L;          // кратко описание
  papers?: string[]; // части от заглавия на публикации от сайта
  topics?: L[];      // напр. тематични направления на щанд
  photos?: { src: string; alt: L }[];   // public/images/… — само малки снимки (до 360 px), без увеличаване и без EXIF
  docs?: { href: string; label: L }[];
  program?: { time: string; item: L }[];
}

const PRES: L = { bg: 'присъствена', en: 'in person' };
const HYB: L = { bg: 'хибридна (присъствена + онлайн)', en: 'hybrid (in person + online)' };
const RM_PLACE: L = { bg: 'София, Институт по роботика — БАН, зала „Макс Планк“', en: 'Sofia, Institute of Robotics — BAS, “Max Planck” hall' };

/** 1. Участия в международни научни форуми прояви (конференции, симпозиуми, семинари и др.) — най-новите първи */
export const participations: NspEvent[] = [
  {
    title: { bg: '4th International Conference on Environmental Protection and Disaster Risks (EnviroRISKs 2026) и 14th Annual CMDR COE Conference on Crisis Management and Disaster Response', en: '4th International Conference on Environmental Protection and Disaster Risks (EnviroRISKs 2026) and 14th Annual CMDR COE Conference on Crisis Management and Disaster Response' },
    date: { bg: '1–3 юни 2026 г.', en: '1–3 June 2026' }, place: { bg: 'София', en: 'Sofia' },
    url: 'https://link.springer.com/book/9783032390707',
    papers: ['A Model of Gravity on the Surface of the Earth', 'A Highly Accurate Calculation of the Difference Between Geocentric and Geodetic Latitude'],
  },
  {
    title: { bg: '15th International Scientific Conference on Engineering, Technology and Systems (TechSys 2026)', en: '15th International Scientific Conference on Engineering, Technology and Systems (TechSys 2026)' },
    date: { bg: '14–16 май 2026 г.', en: '14–16 May 2026' }, place: { bg: 'Пловдив', en: 'Plovdiv' },
    papers: ['Compensations for Horizontal Inertial Components of INS/GNSS', 'Constructive Approach to the Design of Data Protection Systems', 'Small Voice Bulgarian Language Model Generation'],
  },
  {
    title: { bg: 'The 16th International Conference on Business Information Security (BISEC 2025)', en: 'The 16th International Conference on Business Information Security (BISEC 2025)' },
    date: { bg: '28 ноември 2025 г.', en: '28 November 2025' }, place: { bg: 'Ниш, Сърбия (Университет „Метрополитан“)', en: 'Niš, Serbia (Metropolitan University)' }, form: PRES,
    papers: ['Insider Threats in Critical Infrastructure Organizations'],
  },
  {
    title: { bg: 'International Conferences on Digital Technology Driven Engineering (ICDTDE 2025)', en: 'International Conferences on Digital Technology Driven Engineering (ICDTDE 2025)' },
    date: { bg: '18–20 декември 2025 г.', en: '18–20 December 2025' }, place: { bg: 'онлайн (MS Teams), домакин Jordan University of Science and Technology', en: 'online (MS Teams), hosted by Jordan University of Science and Technology' }, form: { bg: 'онлайн', en: 'online' },
    papers: ['Multilayered conceptual modelling for the design, implementation and optimization'],
  },
  {
    title: { bg: '2025 International Conference on Military Communication and Information Systems (ICMCIS 2025), NATO STO', en: '2025 International Conference on Military Communication and Information Systems (ICMCIS 2025), NATO STO' },
    date: { bg: '13–14 май 2025 г.', en: '13–14 May 2025' }, place: { bg: 'Оейраш, Португалия', en: 'Oeiras, Portugal' },
    url: 'https://www.sto.nato.int/document/improvement-in-u-space-development-by-civil-military-cooperation-in-a-multi-domain-operations-environment/',
    papers: ['Improvement in U-Space Development by Civil-Military Cooperation', 'Designing an information security system to prevent leakage of sensitive information'],
  },
  {
    title: { bg: 'The 15th International Conference on Business Information Security (BISEC 2024)', en: 'The 15th International Conference on Business Information Security (BISEC 2024)' },
    date: { bg: '28–29 ноември 2024 г.', en: '28–29 November 2024' }, place: { bg: 'Ниш, Сърбия', en: 'Niš, Serbia' },
    url: 'https://ceur-ws.org/Vol-3971/',
    text: { bg: 'Сборник: CEUR Workshop Proceedings, Vol-3971.', en: 'Proceedings: CEUR Workshop Proceedings, Vol-3971.' },
    papers: ['LSTM-RNN method for Anomaly-Based Intrusion Detection', 'Development of Blockchain-Based Framework for Securing Communication'],
  },
  {
    title: { bg: 'Black Sea Maritime Security Conference', en: 'Black Sea Maritime Security Conference' },
    date: { bg: '6–8 ноември 2024 г.', en: '6–8 November 2024' }, place: { bg: 'Варна, ВВМУ „Н. Й. Вапцаров“', en: 'Varna, Nikola Vaptsarov Naval Academy' },
    papers: ['Мобилен колаборативен робот с висока проходимост'],
  },
  {
    title: { bg: '14th EASN International Conference “Innovation in Aviation & Space towards sustainability today & tomorrow”', en: '14th EASN International Conference “Innovation in Aviation & Space towards sustainability today & tomorrow”' },
    date: { bg: '8–11 октомври 2024 г.', en: '8–11 October 2024' }, place: { bg: 'Солун, Гърция', en: 'Thessaloniki, Greece' },
    papers: ['A Parametric Comparison of JARUS SORA 2.0 and 2.5'],
  },
  {
    title: { bg: '2024 IEEE 12th International Conference on Intelligent Systems (IS)', en: '2024 IEEE 12th International Conference on Intelligent Systems (IS)' },
    date: { bg: '29–31 август 2024 г.', en: '29–31 August 2024' }, place: { bg: 'к.к. Златни пясъци, Варна', en: 'Golden Sands, Varna' },
    papers: ['Aspects of Dependability and Security in Integrated Intelligent Educational Environments'],
  },
  {
    title: { bg: 'Environment. Technology. Resources. 15th International Scientific and Practical Conference', en: 'Environment. Technology. Resources. 15th International Scientific and Practical Conference' },
    date: { bg: '27–28 юни 2024 г.', en: '27–28 June 2024' }, place: { bg: 'Резекне, Латвия', en: 'Rēzekne, Latvia' },
    papers: ['Applicability of JARUS SORA to State UAS Operations in Disaster Relief', 'Skills and attitudes towards using AI based chatbots', 'Implying cybersecurity skills for public administration employees', 'Management approaches and application areas of information security in organizations'],
  },
  {
    title: { bg: 'XVI Специализирано международно изложение за отбранителна техника и услуги „ХЕМУС 2024 — Отбрана, антитероризъм и сигурност“ — щанд на Института по роботика', en: '16th International Defence Exhibition “HEMUS 2024 — Defence, Counter-terrorism and Security” — Institute of Robotics stand' },
    date: { bg: '5–8 юни 2024 г.', en: '5–8 June 2024' }, place: { bg: 'Пловдив, Международен панаир, палата № 7', en: 'Plovdiv, International Fair, Hall 7' }, form: PRES,
    text: { bg: 'Щанд на ИР-БАН с площ 24 кв. м; участници от ИР-БАН, Центъра за компетентност „КВАЗАР“ и филиала на ИР-БАН във Велико Търново — 9 изложители на щанда, общо 15 регистрирани участници заедно с конференцията. Изработени рекламни материали по ННП-СО: 4 банера, 8 вида диплянки и брошури, 10 информационни табели. Цели: демонстрация на технологичните възможности на института и договаряне на бъдеща научноизследователска дейност чрез трансфер на технологии. Модератор: гл. ас. д-р М. Дечев.', en: 'IR-BAS stand of 24 m²; participants from IR-BAS, the QUASAR Centre of Competence and the IR-BAS branch in Veliko Tarnovo — 9 exhibitors at the stand, 15 registered participants in total including the conference. NSP DS promotional materials: 4 banners, 8 leaflets and brochures, 10 information boards. Aims: to demonstrate the Institute’s technological capabilities and to negotiate future research through technology transfer. Moderator: Chief Assist. Prof. Dr. M. Dechev.' },
    people: { bg: 'доц. А. Маджаров, гл. ас. И. Гайдарски, доц. Н. Чехларова, гл. ас. С. Христозов, инж. М. Ралчев (ЦК „КВАЗАР“), доц. Р. Георгиев', en: 'Assoc. Prof. A. Madzharov, Chief Assist. Prof. I. Gaidarski, Assoc. Prof. N. Chehlarova, Chief Assist. Prof. S. Hristozov, Eng. M. Ralchev (QUASAR CoC), Assoc. Prof. R. Georgiev' },
    topics: [
      { bg: 'Емисия на микрочастици в нехомогенни структури при едноосни деформации — инж. М. Ралчев (ЦК „КВАЗАР“)', en: 'Microparticle emission in inhomogeneous structures under uniaxial deformation — Eng. M. Ralchev (QUASAR CoC)' },
      { bg: 'Сензорна система за регистриране и анализ на кардиологични сигнали — доц. д-р инж. Г. Георгиева-Цанева', en: 'Sensor system for recording and analysis of cardiological signals — Assoc. Prof. Dr. Eng. G. Georgieva-Tsaneva' },
      { bg: 'Радарни и антидрон системи (ReGuard 3D, RaMon, RP-2AA) — проф. дтн инж. Н. Личков', en: 'Radar and counter-drone systems (ReGuard 3D, RaMon, RP-2AA) — Prof. DSc Eng. N. Lichkov' },
      { bg: 'Квадрокоптери и радиоуправляеми летателни апарати — доц. А. Маджаров, доц. Р. Георгиев, гл. ас. С. Христозов', en: 'Quadcopters and radio-controlled aircraft — Assoc. Prof. A. Madzharov, Assoc. Prof. R. Georgiev, Chief Assist. Prof. S. Hristozov' },
      { bg: 'Съвременни подходи и средства за опазване на чувствителна информация — гл. ас. И. Гайдарски', en: 'Modern approaches and tools for protecting sensitive information — Chief Assist. Prof. I. Gaidarski' },
      { bg: 'STEM образователни ресурси за различни потребителски групи — доц. Н. Чехларова', en: 'STEM educational resources for different user groups — Assoc. Prof. N. Chehlarova' },
    ],
  },
  {
    title: { bg: 'Годишна конференция на ЦИНСО-БАН „Наука и иновации за сигурност, отбрана и космос“', en: 'CINSO-BAS Annual Conference “Science and Innovation for Security, Defence and Space”' },
    date: { bg: '15 март 2024 г.', en: '15 March 2024' }, place: { bg: 'София, Единен център за иновации на БАН, бл. 26', en: 'Sofia, BAS Innovation Centre, block 26' }, form: PRES,
  },
  {
    title: { bg: 'Научна конференция „Съвременни изследвания и технологии за отбраната“ (ARTDef 2023), Институт по отбрана „Проф. Цветан Лазаров“', en: 'Advanced Research and Technology for Defence (ARTDef 2023), Bulgarian Defence Institute “Prof. Tsvetan Lazarov”' },
    date: { bg: '28–29 ноември 2023 г.', en: '28–29 November 2023' }, place: { bg: 'София, Централен военен клуб', en: 'Sofia, Central Military Club' }, form: PRES,
    papers: ['Design of marine underwater perimeter security system', 'Съвременни подходи за опазване на чувствителна информация'],
  },
  {
    title: { bg: 'The Fourteenth International Conference on Business Information Security (BISEC 2023)', en: 'The Fourteenth International Conference on Business Information Security (BISEC 2023)' },
    date: { bg: '24 ноември 2023 г.', en: '24 November 2023' }, place: { bg: 'Ниш, Сърбия (Университет „Метрополитан“)', en: 'Niš, Serbia (Metropolitan University)' }, form: PRES,
    papers: ['Energy-efficient routing in UAVs supported perimeter security networks', 'Reducing the WSN'],
  },
  {
    title: { bg: 'XI Международна научна конференция „ХЕМУС 2022“', en: '11th International Scientific Conference “HEMUS 2022”' },
    date: { bg: '1–4 юни 2022 г.', en: '1–4 June 2022' }, place: { bg: 'Пловдив, Международен панаир', en: 'Plovdiv, International Fair' },
  },
];

/** 2. Организирани тематични събития (семинари, конференции и др.) */
export const organized: NspEvent[] = [
  {
    title: { bg: 'Работна среща (тематичен семинар) „Приложение на съвременните технологии и системи с изкуствен интелект в авиационната среда и средата за сигурност“', en: 'Workshop (thematic seminar) “Application of modern technologies and artificial-intelligence systems in the aviation and security environment”' },
    date: { bg: '16 май 2025 г.', en: '16 May 2025' }, place: { bg: 'Долна Митрополия, ВВВУ „Георги Бенковски“', en: 'Dolna Mitropolia, Georgi Benkovski Air Force Academy' }, form: HYB,
    people: { bg: 'презентации за постигнатите резултати по ННП-СО и по задача 1.2.3: доц. А. Маджаров, доц. А. Александров, гл. ас. И. Гайдарски и доц. Р. Георгиев (ИР-БАН); по покана на катедра „Електротехника, автоматика и информационни технологии“ на ВВВУ', en: 'presentations of the NSP DS results and of task 1.2.3: Assoc. Prof. A. Madzharov, Assoc. Prof. A. Alexandrov, Chief Assist. Prof. I. Gaidarski and Assoc. Prof. R. Georgiev (IR-BAS); at the invitation of the Department of Electrical Engineering, Automation and Information Technologies of the Academy' },
    text: { bg: 'Семинарът е част от ННП „Сигурност и отбрана“, Компонент 1 „Сигурност“, работен пакет 1.2 „Технологично осигуряване“, задача 1.2.3 „Изследване на роботизирани системи, основани на машинно обучение за анализ на средствата и вземане на решения, както и разработване на прототипи, основани на приложение на изкуствения интелект и роботиката“. Цели: устойчиво сътрудничество между участващите институции, благоприятна среда за обучение и научни изследвания в технологиите, сигурността и отбраната и прилагане на успешни практики и научни разработки чрез трансформирането им в практически приложими продукти; отчет на резултатите по задача 1.2.3 и предизвикателствата от въвеждането на нова авиационна техника и технологии с изкуствен интелект. Участници: военнослужещи, експерти, докторанти и представители на фирми.', en: 'The seminar is part of the NSP “Security and Defence”, Component 1 “Security”, work package 1.2 “Technological support”, task 1.2.3 “Research on robotic systems based on machine learning for analysis and decision making, and development of prototypes based on artificial intelligence and robotics”. Aims: lasting cooperation between the participating institutions, a favourable environment for training and research in technology, security and defence, and the transfer of good practice and research results into practical products; a report on the results of task 1.2.3 and on the challenges of introducing new aviation equipment and AI technologies. Participants: military personnel, experts, PhD students and company representatives.' },
    program: [
      { time: '09:00 – 09:30', item: { bg: 'Регистрация на участниците', en: 'Registration' } },
      { time: '09:30 – 10:00', item: { bg: 'Откриване: приветствие от ръководството на ВВВУ; план за изпълнение и отчет на задача 1.2.3', en: 'Opening: welcome by the Academy; implementation plan and report on task 1.2.3' } },
      { time: '10:00 – 11:00', item: { bg: 'Представяне на фирми от региона; възможности за работа и кариерно развитие, свързани с новите технологии, изкуствения интелект и средата за сигурност', en: 'Regional companies; career opportunities in new technologies, AI and the security environment' } },
      { time: '11:30 – 12:30', item: { bg: 'Взаимовръзката между научните изследвания, бизнеса и потребителите на кадри', en: 'Links between research, business and employers' } },
      { time: '12:30 – 13:00', item: { bg: 'Представяне на дипломен проект', en: 'Presentation of a diploma project' } },
      { time: '14:00 – 15:00', item: { bg: 'Кръгла маса: образованието, изкуственият интелект и подготовката на висококвалифицирани кадри', en: 'Round table: education, artificial intelligence and training of highly qualified personnel' } },
      { time: '16:00', item: { bg: 'Закриване', en: 'Closing' } },
    ],
    photos: [
      { src: '/images/nspsd/vvvu-2025/01-vhod.jpg', alt: { bg: 'Входът на ВВВУ „Георги Бенковски“, Долна Митрополия', en: 'Entrance of the Georgi Benkovski Air Force Academy, Dolna Mitropolia' } },
      { src: '/images/nspsd/vvvu-2025/02-zala.jpg', alt: { bg: 'Залата по време на семинара', en: 'The hall during the seminar' } },
      { src: '/images/nspsd/vvvu-2025/03-prezentacia.jpg', alt: { bg: 'Презентация по ННП-СО', en: 'NSP DS presentation' } },
      { src: '/images/nspsd/vvvu-2025/04-diskusia.jpg', alt: { bg: 'Дискусия', en: 'Discussion' } },
      { src: '/images/nspsd/vvvu-2025/05-uchastnici.jpg', alt: { bg: 'Участниците в семинара', en: 'Seminar participants' } },
    ],
  },
  {
    title: { bg: 'Международна научна конференция „Роботика и мехатроника 2025“ (Robotics & Mechatronics 2025), Институт по роботика — БАН', en: 'International Scientific Conference “Robotics & Mechatronics 2025”, Institute of Robotics — BAS' },
    date: { bg: '5–6 ноември 2025 г.', en: '5–6 November 2025' }, place: RM_PLACE, form: PRES, url: 'https://ir.bas.bg/ccs/2025/09/index.html',
    text: { bg: 'Докладите се публикуват в сп. Complex Control Systems (ISSN 1310-8255, 2603-4697 online), т. 9.', en: 'Papers are published in Complex Control Systems (ISSN 1310-8255, 2603-4697 online), vol. 9.' },
    papers: ['Using disruptive technologies as Blockchains and AI in IoT cybersecurity'],
  },
  {
    title: { bg: 'Международна научна конференция „Роботика и мехатроника 2024“ (Robotics & Mechatronics 2024), Институт по роботика — БАН', en: 'International Scientific Conference “Robotics & Mechatronics 2024”, Institute of Robotics — BAS' },
    date: { bg: '29–30 октомври 2024 г.', en: '29–30 October 2024' }, place: RM_PLACE, form: PRES, url: 'https://ir.bas.bg/ccs/2024/07/index.html',
    text: { bg: 'Сборник: Complex Control Systems, т. 7.', en: 'Proceedings: Complex Control Systems, vol. 7.' },
    papers: ['Design of a testing model for evaluation the levels of automation', 'Design of an Unmanned Helicopter System for Collecting and Processing', 'Some aspects of cybersecurity in Industry 4.0'],
  },
  {
    title: { bg: 'XXIV Международна научна конференция „Роботика и мехатроника 2023“ (Robotics & Mechatronics 2023), Институт по роботика — БАН', en: '24th International Scientific Conference “Robotics & Mechatronics 2023”, Institute of Robotics — BAS' },
    date: { bg: '25–26 април 2023 г.', en: '25–26 April 2023' }, place: RM_PLACE, form: PRES, url: 'https://ir.bas.bg/ccs/2023/06/index.html',
    text: { bg: 'Сборник: Complex Control Systems, т. 6.', en: 'Proceedings: Complex Control Systems, vol. 6.' },
    papers: ['Trajectory optimization in large scale UAV-assisted WSNs', 'Modern Aspects in Information Security in the Field of Robotics'],
  },
];
