// Проверени цитирания на трудовете на А. Маджаров (формат: ../types.ts; точки: ../rules.ts).
// Източник: „Цитирания — А. Маджаров (проверена справка)“, ver05 от 14.10.2026 (SONIX sciRep, проверена и допълнена).
// Номерата на цитираните трудове (no) следват регистъра на НАЦИД (ras.nacid.bg, справка от 14.10.2026),
// продължени с трудовете от Системата (№ 50, 51). Цитиращите източници са в реда на справката (1–56).
// Проверка по критериите на НАЦИД (16.10.2026, решения на А. Маджаров):
//   - самоцитиране = А. Маджаров е сред авторите на цитиращия труд (не се включват; виж справката);
//   - Complex Control Systems (ISSN 1310-8255) е списание → Д-14 (№ 38, 46, 47, 50);
//   - Годишник на ТУ – Варна 2010 (№ 30) → Д-14, както в справката;
//   - без точки и затова невъведени: № 8 (дубликат на № 9), № 15 и № 54 (дисертации);
//   - годината е на цитиращия източник (в SONIX някъде е годината на въвеждане — в бележката);
//   - № 51 (eNeuro), № 53 (LNNS, ICICT 2025) и № 56 (ITHET 2026) са въведени с отметка в „[Нови цитирания]“ (16.10.2026)
//     и са в contrib.json (клон data) — тук не се повтарят (изграждането спира при повторение по DOI).
// Трудовете с `hidden` не са в списъците на сайта (по-стари трудове) — само за цитиранията и точките по група „Д“.
// Добавяйте само цитирания, проверени в самия цитиращ източник; без самоцитирания.
import type { CitedWork } from '../types';

const GETSOV_2011 = 'Гецов, П. Полунатурно конструиране на системите за управление на безпилотни летателни апарати. Монография. София: Академично издателство „Проф. Марин Дринов“, 2011, 201 с., ISBN 978-954-322-459-3';
const IVANOV_2019 = 'Ivanov, V. Use embedded DSP blocks to implement a PID regulator. 19th IFAC Conference on Technology, Culture and International Stability TECIS 2019, Sozopol, Bulgaria, 26–28 September 2019, IFAC-PapersOnLine, 52(25)';
const ANGELOV_2025 = 'Angelov, S. Design and Architecture of Robotized Unmanned Ground Vehicle (UGV)-Based Intrusion Detection Perimeter Security Systems. Complex Control Systems, 2025, 9(2), pp. 1–6, ISSN 1310-8255, e-ISSN 2603-4697';
const BILIDEROV_2020 = 'Biliderov, S., Dimitrova, R., Chakarski, D. Principles of mechatronics in the design of a flight navigation unit for an unmanned aircraft. XXIX ННТК „АДП-2020“, Созопол, 2020, с. 110–115, Издателски комплекс на ТУ – София, ISSN 2682-9584';
const YONKOV_2020 = 'Йонков, Х. Б. Моделиране и техническа експлоатация на авиационното оборудване. Монография. Д. Митрополия: ВВУ „Г. Бенковски“, 2020, 148 с., ISBN 978-954-713-141-5';
const VVVU = 'Научни трудове на ВВВУ „Г. Бенковски“';

const citations: CitedWork[] = [
  // ---------------- 1998 ----------------
  {
    no: 12, pub: {}, hidden: { year: 1998, text: 'Савов, В. С., Маджаров, А. Н. Изследване на възможността за имитиране на бомбопускане при летателни учения. Научна сесия „Перспективи в развитието на въоръжението и военната техника“, 17–19 декември 1997, ВНТИ, София, 1998, с. 462–468' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [
      { year: 2001, ind: '13', text: 'Semerdjiev, E. A., Semerdjiev, T. A., Angelova, D. S. Adaptive Multiple Model Algorithm for Sea Mines Tracking and Type Identification. 4th International Conference on Information Fusion, Montreal, Canada, August 2001' },
    ],
  },
  {
    no: 10, pub: {}, hidden: { year: 1998, text: 'Маджаров, А. Н. Един алгоритъм за съвместно използване на информацията от ИКВ и GPS. Научна сесия „85 години от участието на българската авиация в Балканската война“, 9–10 окт. 1997, т. 2, ВВВУ „Г. Бенковски“, 1998, с. 260–270, ISBN 954-713-022-6' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [
      { year: 2020, ind: '12', index: 'scopus', doi: '10.1007/978-3-030-55347-0_9', text: 'Boneva, Y., Ivanov, V. Improvement of Traffic in Urban Environment through Signal Timing Optimization. In: Dimov, I., Fidanova, S. (Eds) Advances in High Performance Computing, Studies in Computational Intelligence, vol. 902, Springer, 2020, pp. 99–107, ISBN 978-3-030-55346-3, ISSN 1860-949X' },
    ],
  },
  // ---------------- 1999 ----------------
  {
    no: 17, pub: {}, hidden: { year: 1999, text: 'Гецов, П. С., Маджаров, А. Н. Преобразуване на геодезически координати между различни референтни елипсоиди. „Десет години космически проект „Шипка““, Институт за космически изследвания – БАН, 1999, с. 116–120' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [
      { year: 1999, ind: '14', text: `Тодоров, П. Ц. Повишаване на точността на УВД и навигацията с GPS при отстраняване грешката, предизвикана от несъответствието между използваните референц-елипсоиди. ${VVVU}, бр. 61, 1999, с. 63–70, ISSN 1310-7682` },
    ],
  },
  {
    no: 14, pub: {}, hidden: { year: 1999, text: `Маджаров, А. Н. Високо точно изчисляване на геодезически координати във височина. ${VVVU}, бр. 61, 1999, с. 38–45, ISSN 1310-7682` },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2011, ind: '13', text: GETSOV_2011 }],
  },
  {
    no: 15, pub: {}, hidden: { year: 1999, text: `Маджаров, А. Н. Точно изчисляване на силата на тежестта във височина. ${VVVU}, бр. 61, 1999, с. 46–53, ISSN 1310-7682` },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [
      { year: 2004, ind: '14', text: 'Георгиев, Р. Ж. Алгоритми, моделиращи свойствата на атмосферата и гравитационното поле на Земята в SIMULINK. Годишник на Техническия университет – София, т. 54, кн. 1, 2004, с. 147–156, ISSN 0374-342X' },
      { year: 2011, ind: '13', text: GETSOV_2011 },
    ],
  },
  {
    no: 16, pub: {}, hidden: { year: 1999, text: `Маджаров, А. Н. Използване на модел на гравитационно поле в уравненията на инерциалната навигация. ${VVVU}, бр. 61, 1999, с. 54–62, ISSN 1310-7682` },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2011, ind: '13', text: GETSOV_2011 }],
  },
  // ---------------- 2000 ----------------
  {
    no: 22,
    pub: { isbn: '954-713-046-3' }, // Жироскопи и инерциални навигационни системи (2000)
    source: 'НАЦИД (2021), SONIX, справка ver05 (14.10.2026)',
    cites: [
      { year: 2002, ind: '13', text: 'Гецов, П. С., Пътев, Н. Й. Синтез на цифров нелинеен модел на самолет L-39 в средата на MATLAB. Сборник доклади на Юбилейна научна сесия „110 години въздухоплаване в България“, 25–26 април 2002 г., ВВВУ „Г. Бенковски“, Д. Митрополия, т. 2, ISBN 954-713-057-9' },
      { year: 2004, ind: '13', text: 'Георгиев, Р. Ж. Динамически характеристики на микромеханичен жироскоп в режим датчик на ъгъла на завъртане. Сборник доклади на Юбилейна научна сесия „90 години авиационно образование в България“, 22–23 април 2004 г., НВУ „В. Левски“, факултет „Авиационен“, Д. Митрополия, т. 2, с. 219–224, ISBN 954-713-052-2' },
      { year: 2005, ind: '13', text: 'Георгиев, Р. Ж. Анализ и диагностика на полетни данни в реално време. Сборник доклади на Юбилейна научна сесия, 22–23 април 2005 г., НВУ „В. Левски“, факултет „Авиационен“, Д. Митрополия, т. 2, ISBN 954-713-052-2' },
      { year: 2005, ind: '13', text: 'Георгиев, Р. Ж. Анализ на грешките при измерване параметрите на краткопериодичното движение на ЛА. Сборник доклади на Юбилейна научна сесия, 22–23 април 2005 г., НВУ „В. Левски“, факултет „Авиационен“, Д. Митрополия, т. 2, ISBN 954-713-052-2' },
      { year: 2006, ind: '13', text: 'Панова, П. В. Полетни условия за самолетната гравиметрия. SENS’2006, 14–16 June 2006, Varna, Space Research Institute – Bulgarian Academy of Sciences, ISSN 1313-3888', url: 'http://space.bas.bg/SES/archive/SENS%202006_DOKLADI/CD/A7.pdf' },
      { year: 2008, ind: '13', text: 'Panova, P., Getsov, P. Platform and Strapdown Inertial Navigation Systems Use for Hydrocarbons Search in Sea Shelf. SENS 2007, Proceedings 2008, Space Research Institute – Bulgarian Academy of Sciences, pp. 107–113, ISSN 1313-3888', url: 'http://www.space.bas.bg/SES/archive/SENS%202007_DOKLADI/2_Aerospace/2_Panova.pdf' },
      { year: 2007, ind: '13', text: 'Билидеров, С. С. Управление на автономен безпилотен летателен апарат по зададена траектория. III национална студентска научно-техническа конференция, София, 2007, с. 79–86, ISBN 978-954-438-647-4' },
      { year: 2007, ind: '13', text: 'Камбушев, М. М. Изследване надлъжната устойчивост на самолет L-39. Сборник доклади на Юбилейна научна сесия „50 години от полета на първия изкуствен спътник на Земята“, 12–13 април 2007 г., НВУ „В. Левски“, факултет „Авиационен“, Д. Митрополия, 2007, с. 339–347, ISBN 978-954-713-091-3' },
      { year: 2008, ind: '13', text: 'Билидеров, С. С. Синтезиране на ПИД регулатор за работа в авиационни вградени системи. Сборник доклади на Юбилейна научна сесия „100 години от обявяване независимостта на България“, НВУ „В. Левски“, факултет „Авиационен“, Д. Митрополия, 2008, с. 79–86, ISBN 978-954-713-092-0' },
      { year: 2009, ind: '13', text: 'Билидеров, С. С. Проектиране и разработване на система за траекторно управление на автономен безпилотен летателен апарат. Сборник научни трудове на Шуменски университет, Шумен, 2009, т. 2, с. 331–338, ISBN 978-954-577-540-6' },
      { year: 2009, ind: '13', text: 'Камбушев, М. М. Нелинеен модел на движение на летателен апарат. Сборник доклади на XVIII ННТК с международно участие „АДП-2009“, Технически университет – София, 2009, с. 615–620, ISSN 1310-3946' },
      { year: 2010, ind: '14', text: 'Билидеров, С. С., Камбушев, М. М. Имитационно моделиране на траекторното движение на проектиран автономен безпилотен летателен апарат. Годишник на Технически университет – Варна, 2010, т. 1, с. 65–70, ISSN 1311-896X', note: 'Д-14 (годишник с ISSN — списание), по справката ver05; в НАЦИД (2021) — Д-13.' },
      { year: 2011, ind: '13', text: GETSOV_2011 },
      { year: 2020, ind: '13', text: BILIDEROV_2020, note: 'В SONIX: @2022.' },
      { year: 2020, ind: '13', text: 'Георгиев, Р. Ж. Повишаване на точността и надеждността на измерване параметрите на полета. Сборник доклади от годишната международна научна конференция на ВВВУ „Г. Бенковски“, 16 октомври 2020 г., Д. Митрополия, с. 159–168, ISSN 2738-716X' },
      { year: 2019, ind: '13', text: 'Билидеров, С. С. Мехатроника и автономни безпилотни системи. Монография. Д. Митрополия, 2019, 210 с., ISBN 978-954-713-136-1 (CD)', note: 'В SONIX: @2023.' },
      { year: 2023, ind: '13', text: 'Илиева, Д. В. Симулация на траекторното управление на безпилотен летателен апарат със SIMULINK/MATLAB. Сборник доклади от годишната международна научна конференция на ВВВУ „Г. Бенковски“, 6 октомври 2023 г., Д. Митрополия, с. 233–240, ISSN 2738-716X' },
    ],
  },
  {
    no: 23,
    pub: { isbn: '954-713-042-0' }, // Структура и приложение на глобалните навигационни системи NAVSTAR и ГЛОНАСС (2000)
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [
      { year: 2003, ind: '13', text: 'Билидеров, С., Георгиев, Р. Ж. Оценка на статистическите характеристики на относителното положение на обекти в системата GPS. Юбилейна научна сесия на Факултет „Авиационен“ с международно участие „100 години от полета на братя Райт“, т. 2, Д. Митрополия, 2003, с. 215–223, ISBN 954-713-65-X (т. 2)', note: 'Същият доклад е въведен в SONIX и с автор само Р. Ж. Георгиев — отчита се веднъж.' },
      { year: 2011, ind: '13', text: GETSOV_2011 },
      { year: 2014, ind: '13', text: 'Павлов, А., Величков, Н. Изследване на точността на GPS приемник чрез изчисляване на геометричния фактор за работно съзвездие. Bultrans-2014, Proceedings, 17–19 September 2014, Sozopol, Издателство на ТУ – София, с. 99–102, ISSN 1313-955X' },
      { year: 2020, ind: '12', index: 'scopus', doi: '10.1109/ET50336.2020.9238254', text: 'Biliderov, S., Kambushev, M., Kambushev, K., Marinov, A., Dimitrova, R. Recovery of GPS disability to unmanned aircrafts by system modeling. XXIX International Scientific Conference Electronics – ET2020, 16–18 September 2020, Sozopol, Bulgaria, IEEE' },
      { year: 2020, ind: '13', text: BILIDEROV_2020, note: 'В SONIX: @2023.' },
    ],
  },
  {
    no: 18, pub: {}, hidden: { year: 2000, text: `Madzharov, A. N. Airborne gravity field measurements by using inertial navigation systems and differential global positioning system. ${VVVU}, бр. 62, 2000, с. 121–130, ISSN 1310-7682` },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2011, ind: '13', text: GETSOV_2011 }],
  },
  {
    no: 19, pub: {}, hidden: { year: 2000, text: `Madzharov, A. N. An algorithm for strapdown inertial navigation system. ${VVVU}, бр. 62, 2000, с. 131–139, ISSN 1310-7682` },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [
      { year: 2011, ind: '13', text: GETSOV_2011 },
      { year: 2016, ind: '12', index: 'scopus', doi: '10.1007/978-981-10-0937-2_41', text: 'Wang, R., Zou, D., Pei, L., Liu, P., Xu, C. Velocity Prediction for Multi-rotor UAVs Based on Machine Learning. In: China Satellite Navigation Conference (CSNC) 2016 Proceedings: Volume II, Lecture Notes in Electrical Engineering, vol. 389, Springer, Singapore, 2016' },
    ],
  },
  {
    no: 20, pub: {}, hidden: { year: 2000, text: `Маджаров, А. Н. Проблеми при изчисляване на абсолютното ускорение на самолет по данни от GPS. ${VVVU}, бр. 62, 2000, с. 140–147, ISSN 1310-7682` },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2011, ind: '13', text: GETSOV_2011 }],
  },
  // ---------------- 2004–2005 ----------------
  {
    no: 25, pub: {}, hidden: { year: 2004, text: 'Маджаров, А. Н., Билидеров, С. С. Обучаваща система за особените случаи в полет на самолет L-39. Сборник доклади на Юбилейна научна сесия „90 години авиационно образование в България“, 22–23 април 2004 г., т. 2, НВУ „В. Левски“, факултет „Авиационен“, Д. Митрополия, 2004, с. 230–240, ISBN 954-713-069-2' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [
      { year: 2007, ind: '13', text: 'Билидеров, С. С. Проектиране на автоматизирана информационно-справочна система за докторанти във факултет „Авиационен“. Сборник доклади на Юбилейна научна сесия „50 години от полета на първия изкуствен спътник на Земята“, 2007, с. 367–377, ISBN 978-954-713-091-3' },
      { year: 2007, ind: '13', text: 'Билидеров, С. С. Автоматизирана информационна система за управление на класните отделения от студенти във факултет „Авиационен“. Сборник доклади на Юбилейна научна сесия „50 години от полета на първия изкуствен спътник на Земята“, 2007, с. 378–392, ISBN 978-954-713-091-3' },
      { year: 2023, ind: '14', text: 'Chehlarova, N. Management of a dance with Photon Robot. Complex Control Systems, 2023 (Proceedings of the International Scientific Conference “Robotics & Mechatronics 2023”), ISSN 1310-8255', note: 'Д-14: Complex Control Systems е списание (ISSN, том и брой); в справката — Д-13.' },
      { year: 2023, ind: '13', text: 'Чехларова, Н. Изследване на системата за е-бизнес в контекста на повишаване на дигиталната компетентност на потребителите. Монография. София: Тонедико, 2023, 170 с., ISBN 978-619-91492-8-7' },
    ],
  },
  {
    no: 27, pub: {}, hidden: { year: 2004, text: 'Маджаров, А. Н., Георгиев, Р. Ж., Билидеров, С. С. Оптимално управление в надлъжния канал на летателен апарат при външни смущения. Годишник на Техническия университет – София, т. 54, кн. 1, 2004, с. 157–165, ISSN 0374-342X' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2019, ind: '12', index: 'scopus', doi: '10.1016/j.ifacol.2019.12.559', text: IVANOV_2019, note: 'В SONIX: @2020.' }],
  },
  {
    no: 30, pub: {}, hidden: { year: 2005, text: 'Маджаров, А. Н., Билидеров, С. С. Моделиране траекторното движение на летателен апарат по зададен маршрут и профил на полета. XII Международна научно-техническа конференция Trans&MOTAUTO’05+, 23–25 November 2005, В. Търново, т. 2, Proceedings „Technics and Technologies“, 2005, с. 138–141' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2020, ind: '13', text: YONKOV_2020 }],
  },
  {
    no: 29, pub: {}, hidden: { year: 2005, text: 'Маджаров, А. Н., Билидеров, С. С. Моделиране движението на ортогонален репер върху геодезична повърхност. Курсантско-студентска научна конференция, НВУ „Васил Левски“, В. Търново, 2005, с. 91–98, ISBN 954-753-035-6' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2020, ind: '13', text: YONKOV_2020 }],
  },
  // ---------------- 2018–2024 ----------------
  {
    no: 54, pub: {}, hidden: { year: 2018, text: 'Маджаров, А. Н. Квантови сензори за навигация и измерване на гравитацията. Научна конференция „50 години безпилотна авиация в България“, 11–12.04.2018, Технически университет – София, Филиал Пловдив, 2018, ISSN 1310-8271' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2019, ind: '12', index: 'scopus', doi: '10.1016/j.ifacol.2019.12.559', text: IVANOV_2019 }],
  },
  {
    no: 35,
    pub: { title: 'Technical implementation of a reporting system' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [
      { year: 2023, ind: '14', doi: '10.7546/PECR.79.23.03', text: 'Gaidarski, I., Kutinchev, P. Some aspects of Information Security and Cybersecurity problem area. Problems of Engineering Cybernetics and Robotics, 79, Bulgarian Academy of Sciences, 2023, pp. 55–66, ISSN 2738-7356' },
      { year: 2024, ind: '12', index: 'scopus', text: 'Gaidarski, I., Chehlarova, N. Management approaches and application areas of information security in organizations. Environment. Technology. Resources: Proceedings of the 15th International Scientific and Practical Conference, 27–28 June 2024, vol. 2, Rezekne Academy of Technologies, Latvia, 2024, pp. 110–113, ISSN 1691-5402, e-ISSN 2256-070X' },
    ],
  },
  {
    no: 37,
    pub: { title: 'Design of marine underwater perimeter security system' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2025, ind: '14', text: ANGELOV_2025, url: 'http://ir.bas.bg/ccs/2025/09/2.pdf', note: 'Д-14: Complex Control Systems е списание; в справката — Д-13.' }],
  },
  {
    no: 36,
    pub: { doi: '10.5281/zenodo.10684996' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2025, ind: '14', text: ANGELOV_2025, url: 'http://ir.bas.bg/ccs/2025/09/2.pdf', note: 'Д-14: Complex Control Systems е списание; в справката — Д-13.' }],
  },
  {
    no: 41,
    pub: { doi: '10.17770/etr2024vol4.8238' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2026, ind: '14', doi: '10.35467/cal/220521', text: 'Kaczmarek, K. Cyber-deterrence of Finland and the Nordic countries – a model of digital deterrence and state security. Cybersecurity and Law, vol. 15, no. 1, 2026, pp. 69–79' }],
  },
  {
    no: 44,
    pub: { doi: '10.11610/isij.5546' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2026, ind: '14', doi: '10.7546/PECR.84.26.03', text: 'Yoshinov, R., Dishkova, G., Chehlarova, N. Assessment of Parents’ Awareness in the Field of Cybersecurity. Problems of Engineering Cybernetics and Robotics, vol. 84, Bulgarian Academy of Sciences, 2026, p-ISSN 2738-7356, e-ISSN 2738-7364' }],
  },
  {
    no: 40,
    pub: { doi: '10.5281/zenodo.11396636' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2025, ind: '14', text: ANGELOV_2025, url: 'http://ir.bas.bg/ccs/2025/09/2.pdf', note: 'Д-14: Complex Control Systems е списание; в справката — Д-13.' }],
  },
  {
    no: 38,
    pub: { doi: '10.3389/frobt.2024.1414853' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [
      { year: 2025, ind: '14', text: 'Bulatova, O. Yu., Zyryanov, V. V. Lifecycle Concept of a Cyber-Physical-Social Transport System During Mass Events. Transport of the Russian Federation, 2025, (6), pp. 50–54 (in Russian)', note: 'В SONIX: @2026.' },
    ],
  },
  {
    no: 42,
    pub: { doi: '10.17770/etr2024vol2.8064' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    cites: [{ year: 2026, ind: '12', index: 'scopus', doi: '10.53656/math2026-3-5-sar', text: 'Petkov, I. STEM in action – role-playing games and artificial intelligence in the modern classroom. Mathematics and Informatics, 69(3), 2026, pp. 315–326', note: 'Д-12: да се провери индексирането на списанието в Scopus / WoS.' }],
  },
  {
    no: 43,
    pub: { doi: '10.1109/ITHET61869.2024.10837594' },
    source: 'SONIX, справка ver05 (14.10.2026)',
    // № 56 (ITHET 2026) е въведено с отметка в заявката „[Нови цитирания]“ — src/data/citations/madzharov/contrib.json (клон data)
    cites: [],
  },
];

export default citations;
