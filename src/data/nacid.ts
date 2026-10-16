// „Точки НАЦИД“ в „Обобщен отчет“: точките на член на колектива по групите показатели А–Е
// (Минимални национални изисквания — ППЗРАСРБ; Правилник на БАН, Таблица 1 и 2, Област 5 „Технически науки“,
// към който препращат Вътрешните правила на ИР-БАН, Приложение 4). Показва се като квадратче „Точки НАЦИД“
// с бутон към таблицата „Изисквания … и точки“ (src/views/Archive.astro).
// Група „Д“ НЕ се въвежда тук — изчислява се от проверените цитирания в Системата (src/data/citations/<id>/:
// въведените на ръка + въведените през формата и с отметка), затова се обновява сама.
// Групи А, В, Г, Е — по трудовете/дейностите по-долу (точки = формула; n — брой автори).
import type { Lang } from './content';

export interface NacidItem { no?: string; year: string; text: string; n?: number; formula: string; pts: number }
export interface NacidGroup { key: 'А' | 'Б' | 'В' | 'Г' | 'Д' | 'Е'; label: Record<Lang, string>; req: (number | null)[]; pts?: number; items?: NacidItem[]; note?: Record<Lang, string> }
export interface NacidRecord {
  member: string;
  /** дата на проверената справка */
  date: string;
  source: Record<Lang, string>;
  /** колоните с изискванията */
  cols: Record<Lang, string>[];
  groups: NacidGroup[];
  notes: Record<Lang, string>[];
}

const COLS: Record<Lang, string>[] = [
  { bg: 'Доктор', en: 'PhD' }, { bg: 'Доктор на науките', en: 'DSc' }, { bg: 'Главен асистент', en: 'Chief Assist. Prof.' },
  { bg: 'Доцент', en: 'Assoc. Prof.' }, { bg: 'Професор', en: 'Professor' },
];
const v = (pts: number) => Math.round(pts * 100) / 100;
const share = (base: number, n: number) => base / n; // закръгля се само сборът (groupPts) и показването

const madzharov: NacidRecord = {
  member: 'madzharov',
  date: '14.10.2026',
  source: {
    bg: 'Справка „Цитирания — А. Маджаров (проверена справка)“, ver05 от 14.10.2026 г. (SONIX, НАЦИД), проверена по критериите на НАЦИД на 16.10.2026 г.',
    en: 'Report “Citations — A. Madzharov (verified)”, ver05 of 14 Oct 2026 (SONIX, NACID), checked against the NACID criteria on 16 Oct 2026.',
  },
  cols: COLS,
  groups: [
    { key: 'А', label: { bg: 'Показател 1 — дисертационен труд за ОНС „доктор“', en: 'Indicator 1 — PhD dissertation' }, req: [50, 50, 50, 50, 50],
      items: [{ year: '1991', text: 'Научна степен „кандидат на техническите науки“ (ВАК), приравнена на ОНС „доктор“', formula: '50', pts: 50 }] },
    { key: 'Б', label: { bg: 'Показател 2 — дисертационен труд за НС „доктор на науките“', en: 'Indicator 2 — DSc dissertation' }, req: [null, 100, null, null, null] },
    { key: 'В', label: { bg: 'Показател 3 или 4 — хабилитационен труд (монография или публикации в Scopus/WoS)', en: 'Indicator 3 or 4 — habilitation work (monograph or Scopus/WoS papers)' }, req: [null, null, null, 100, 100],
      note: { bg: 'Показател 4 изисква поне 10 публикации в Scopus/WoS; към 14.10.2026 г. те са 9 — десетата ще бъде всяка от двете глави в EnviroRISKs 2026 (LNNS, Springer) след излизането ѝ.', en: 'Indicator 4 requires at least 10 Scopus/WoS papers; as of 14 Oct 2026 there are 9 — the tenth will be either of the two EnviroRISKs 2026 chapters (LNNS, Springer) once published.' },
      items: [
        { no: '38', year: '2024', n: 5, formula: '60/5', pts: share(60, 5), text: 'Dimitrova, Chehlarova, Madzharov, Krastev, Chavdarov. Psychophysics of user acceptance of social cyber-physical systems. Frontiers in Robotics and AI 11 (Scopus, WoS Q2)' },
        { no: '50', year: '2026', n: 3, formula: '60/3', pts: share(60, 3), text: 'Madzharov, Hristozov, Gaidarski. Compensations for Horizontal Inertial Components of INS/GNSS with Flight Altitude. Eng. Proc. 150(1), 70 (Scopus Q3)' },
        { no: '51', year: '2026', n: 2, formula: '60/2', pts: share(60, 2), text: 'Gaidarski, Madzharov. Constructive Approach to the Design of Data Protection Systems. Eng. Proc. 150(1), 53 (Scopus Q3)' },
        { no: '39', year: '2024', n: 6, formula: '60/6', pts: share(60, 6), text: 'Dimitrova, Kostova, Chavdarov, Krastev, Chehlarova, Madzharov. Psychosocial and Psychophysical Aspects of the Interaction with Humanoid Robots. CompSysTech ’24, ACM ICPS (Scopus Q4)' },
        { no: '41', year: '2024', n: 4, formula: '60/4', pts: share(60, 4), text: 'Yoshinov, Kotseva, Madzharov, Chehlarova. Implying cybersecurity skills for public administration employees. ETR 2024, vol. 4 (Scopus Q4)' },
        { no: '42', year: '2024', n: 4, formula: '60/4', pts: share(60, 4), text: 'Yoshinov, Kotseva, Madzharov, Chehlarova. Skills and attitudes towards using AI based chatbots. ETR 2024, vol. 2 (Scopus Q4)' },
        { no: '40', year: '2024', n: 2, formula: '60/2', pts: share(60, 2), text: 'Alexandrov, Madzharov. Energy-efficient routing in UAVs supported perimeter security networks. BISEC 2023, CEUR-WS 3676 (Scopus Q4)' },
        { no: '43', year: '2024', n: 4, formula: '60/4', pts: share(60, 4), text: 'Dimitrova, Chehlarova, Madzharov, Krastev. A Psychophysical View on User Acceptance of Robotic Systems for Social Applications. ITHET 2024, IEEE (Scopus)' },
        { no: '28', year: '2004', n: 3, formula: '60/3', pts: share(60, 3), text: 'Madjarov, Panova, Getsov. Theoretical research of possibilities for gravitation measurements in motion using the INS. 55th IAC, Vancouver (Scopus)' },
      ] },
    { key: 'Г', label: { bg: 'Сума от показатели 5–11 — публикации', en: 'Sum of indicators 5–11 — publications' }, req: [30, 100, null, 200, 200],
      note: { bg: 'Без трудовете № 1–24 (1990–2001, вкл. монографиите „Жироскопи и инерциални навигационни системи“ и NAVSTAR и ГЛОНАСС): по ЗРАСРБ трудовете от предишни процедури („кандидат на науките“, „доцент“ — ВАК, 2001) не се ползват повторно.', en: 'Works No. 1–24 (1990–2001, incl. the monographs on gyroscopes and on NAVSTAR and GLONASS) are excluded: under the Act, works used in earlier procedures (PhD, Assoc. Prof. — 2001) cannot be reused.' },
      items: [
        { no: '25', year: '2004', n: 2, formula: '20/2', pts: share(20, 2), text: 'Маджаров, Билидеров. Обучаваща система за особените случаи в полет на самолет L-39. НВУ, 2004, т. 2, с. 230–240' },
        { no: '26', year: '2004', n: 2, formula: '20/2', pts: share(20, 2), text: 'Маджаров, Билидеров. Алгоритъм за съвместна обработка на сигналите от GPS приемник и аерометричен датчик за височина. ХЕМУС 2004, с. 81–92' },
        { no: '27', year: '2004', n: 3, formula: '20/3', pts: share(20, 3), text: 'Маджаров, Георгиев, Билидеров. Оптимално управление в надлъжния канал на летателен апарат при външни смущения. Годишник на ТУ – София, т. 54, кн. 1, с. 157–165' },
        { no: '29', year: '2005', n: 2, formula: '20/2', pts: share(20, 2), text: 'Маджаров, Билидеров. Моделиране движението на ортогонален репер върху геодезична повърхност. НВУ, с. 91–98' },
        { no: '30', year: '2005', n: 2, formula: '20/2', pts: share(20, 2), text: 'Маджаров, Билидеров. Моделиране траекторното движение на летателен апарат по зададен маршрут и профил на полета. Trans&MOTAUTO’05+, с. 138–141' },
        { no: '31', year: '2006', n: 2, formula: '20/2', pts: share(20, 2), text: 'Madzharov, Biliderov. The influence of the Free air anomaly over the stability of the vertical channel in SINS. Cartography & GIS 2006' },
        { no: '32', year: '2006', n: 1, formula: '20/1', pts: 20, text: 'Madzharov. Applying corrections from the theoretical model of the geoid when differential mode of GPS is used in landing. Cartography & GIS 2006, pp. 1–8' },
        { no: '33', year: '2008', n: 2, formula: '20/2', pts: share(20, 2), text: 'Маджаров, Камбушев. Изследване за стабилизируемост на линеаризиран аеродинамичен модел на БЛА. НВУ, 2008, т. 2, с. 230–240' },
        { no: '54', year: '2018', n: 1, formula: '20/1', pts: 20, text: 'Маджаров. Квантови сензори за навигация и измерване на гравитацията. „50 години безпилотна авиация в България“, ТУ – София, Филиал Пловдив' },
        { no: '35', year: '2019', n: 1, formula: '20/1', pts: 20, text: 'Madzharov. Technical implementation of a reporting system and its workflows. DefTech 2019, pp. 316–322' },
        { no: '36', year: '2023', n: 2, formula: '20/2', pts: share(20, 2), text: 'Alexandrov, Madzharov. Trajectory optimization in large scale UAV-assisted WSNs. Complex Control Systems' },
        { no: '37', year: '2023', n: 2, formula: '20/2', pts: share(20, 2), text: 'Alexandrov, Madzharov. Design of marine underwater perimeter security system. ARTDef 2023, Институт по отбрана, pp. II-36–II-43' },
        { no: '44', year: '2024', n: 2, formula: '20/2', pts: share(20, 2), text: 'Gaidarski, Madzharov. Applying a New Approach to Consider the Human Factor in the Design of Information Security Systems. ISIJ 55(3), pp. 261–272' },
        { no: '45', year: '2024', n: 3, formula: '20/3', pts: share(20, 3), text: 'Madzharov, Georgiev, Hristozov. Blockchain enhancing IoD network functionality. Complex Control Systems 8' },
        { no: '46', year: '2024', n: 6, formula: '20/6', pts: share(20, 6), text: 'Madzharov, Hristozov, Chehlarova, Georgiev, Gaidarski, Alexandrov. Design of an Unmanned Helicopter System for Collection and Processing of Geophysical Information. Complex Control Systems 7' },
        { no: '47', year: '2024', n: 3, formula: '20/3', pts: share(20, 3), text: 'Hristozov, Madzharov, Chehlarova. Design of a testing model for evaluation the levels of automation and autonomy of a helicopter autopilot. Complex Control Systems 7' },
        { no: '48', year: '2025', n: 3, formula: '20/3', pts: share(20, 3), text: 'Hristozov, Stanev, Madzharov. Improvement in U-space development by civil military cooperation… ICMCIS 2025, NATO STO-MP-IST-209' },
        { no: '49', year: '2025', n: 1, formula: '20/1', pts: 20, text: 'Madzharov. The applicability of quantum gyroscopes for navigation. Engineering Sciences LXII(1), pp. 37–44' },
      ] },
    { key: 'Д', label: { bg: 'Сума от показатели 12–15 — цитирания', en: 'Sum of indicators 12–15 — citations' }, req: [null, 100, null, 50, 100],
      note: { bg: 'Изчислено от проверените цитирания в Системата (въведени на ръка, през формата и с отметка); самоцитиранията (А. Маджаров сред авторите на цитиращия труд) не се включват.', en: 'Computed from the verified citations in the System (entered by hand, through the form and by tick); self-citations (A. Madzharov among the authors of the citing work) are not included.' } },
    { key: 'Е', label: { bg: 'Сума от показатели 16 до края — проекти, ръководство, учебници и др.', en: 'Sum of indicators 16 onwards — projects, supervision, textbooks etc.' }, req: [null, null, null, null, 150],
      note: { bg: 'Включва ръководството на двама успешно защитили докторанти (ВВВУ „Г. Бенковски“; А. Маджаров — единствен научен ръководител, 40/n при n = 1).', en: 'Includes the supervision of two successfully defended doctoral students (Georgi Benkovski Higher Air Force School; A. Madzharov sole supervisor, 40/n with n = 1).' },
      items: [
        { formula: '40/1', n: 1, pts: 40, year: '', text: 'Ръководство на успешно защитил докторант: Стефан Билидеров, ВВВУ „Г. Бенковски“ — единствен научен ръководител (показател 17)' },
        { formula: '40/1', n: 1, pts: 40, year: '', text: 'Ръководство на успешно защитил докторант: Мартин Камбушев, ВВВУ „Г. Бенковски“ — единствен научен ръководител (показател 17)' },
        { year: '2013', n: 1, formula: '40/1', pts: 40, text: 'Учебник „Структура и приложение на спътниковите навигационни системи“, НВУ „В. Левски“, 177 с., ISBN 978-954-753-168-0 (показател 23)' },
        { year: '2022–2026', formula: '20', pts: 20, text: 'Ръководство на колектива на ИР-БАН по ННП „Сигурност и отбрана“, МОН, споразумение № Д01-74/19.05.2022 (показател 20)' },
        { year: '2025–2026', formula: '10', pts: 10, text: 'Участие (софтуерен инженер) в проект BG06RDNP001-16.003-0013, ПРСР 2014–2020 (показател 18)' },
        { year: '2003', formula: '20', pts: 20, text: 'Ръководство на проект „Проектиране и разработка на енергоспестяващ статичен преобразовател на авиационни напрежения“, Основна програма 10 на МО (показател 20)' },
        { year: '2003', formula: '20', pts: 20, text: 'Ръководство на проект „Проектиране и изработване на навигационно-информационен блок за комплексна обработка на сигнали от GPS, инерциална система и аерометрични датчици“, Основна програма 10 на МО (показател 20)' },
        { year: '2003–2004', formula: '20', pts: 20, text: 'Ръководство на проект за лаборатория „Автоматизирани средства за управление и измерване“, Основна програма 10 на МО (показател 20)' },
        { year: '2003–2004', formula: '20', pts: 20, text: 'Ръководство на проект „Акумулаторно-зарядна станция АЗС 20 НК 2“, Основна програма 10 на МО (показател 20)' },
        { year: '2018–2023', formula: '10', pts: 10, text: 'Участие (изследовател) в проект „Дигитализация на икономиката в среда на Големи данни“, BG05M2OP001-1.002, ОП НОИР, УНСС (показател 18)' },
        { year: '2020–2021', formula: '10', pts: 10, text: 'Участие (експерт) в ННП „ИКТ за единен цифров пазар в науката, образованието и сигурността“ (показател 18)' },
        { year: '2013–2014', formula: '10', pts: 10, text: 'Участие в проект BG051PO001-4.3.04-0016, ОП РЧР, НВУ „В. Левски“ (показател 18)' },
        { year: '2014', formula: '10', pts: 10, text: 'Участие (експерт уеб програмиране) в проект BG051PO001-3.1.08-0024, ОП РЧР, НВУ „В. Левски“ (показател 18)' },
        { year: '2002–2003', formula: '10', pts: 10, text: 'Участие (отговорник по т. 4.2) в проект „Усъвършенстване на университетска система за управление на качеството на обучение във висшите военни училища“, МОН (показател 18)' },
      ] },
  ],
  notes: [
    { bg: 'Източник на минималните изисквания: Правилник за условията и реда за придобиване на научни степени и за заемане на академични длъжности в БАН (Таблица 1 и 2, Област 5 „Технически науки“), към който препращат Вътрешните правила на ИР-БАН (Приложение 4; изм. 23.11.2018 г.).', en: 'Minimum requirements: BAS regulations on scientific degrees and academic positions (Tables 1 and 2, Area 5 “Technical Sciences”), referred to by the IR-BAS internal rules (Annex 4; amended 23 Nov 2018).' },
    { bg: 'Точките по показатели 4, 8 и 23 са разделени на n — броя на авторите. Трудовете под печат не са включени.', en: 'Points for indicators 4, 8 and 23 are divided by n, the number of authors. In-press works are not included.' },
  ],
};

export const nacidRecords: Record<string, NacidRecord> = { madzharov };
export const groupPts = (g: NacidGroup) => v((g.items ?? []).reduce((s, x) => s + x.pts, 0));
export const fmtPts = (x: number, lang: Lang) => (Math.round(x * 100) / 100).toLocaleString(lang === 'bg' ? 'bg-BG' : 'en-GB', { maximumFractionDigits: 2 });
