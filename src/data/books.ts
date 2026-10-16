// Отделни страници за монографии и книги (/publications/books/<slug>/ и /en/publications/books/<slug>/).
// Целта: търсачките да виждат пълните данни за книгата (текст на страницата, JSON-LD Book,
// мета данни за Google Scholar) и големия банер. Записът в годишния списък (archiveEarlier.ts)
// сочи към страницата с полето `page` (заглавието е връзката).
// Данните са от самите книги (титул, анотация, съдържание, последна страница), от COBISS.BG и от
// Националния регистър на издаваните книги (booksinprint.bg).
import type { Lang } from './content';

type T = { bg: string; en: string };

export interface BookPage {
  slug: string;              // адрес: publications/books/<slug>
  title: string;             // заглавие на езика на книгата
  tr: string;                // превод на заглавието
  kind: T;                   // вид (монография …)
  hab?: T;                   // хабилитационен труд — процедура, година
  kindNote?: T;              // пояснение към вида (показва се до етикета, ако няма hab)
  authorId: string;          // ключ в src/data/team
  authorFull: T;             // името, както е в книгата
  coauthors?: T[];           // съавтори (извън src/data/team)
  authorOnBook: T;           // титлата към момента на издаването
  publisher: T;
  place: T;
  year: number;
  printed?: string;          // дадено за печат (ДД.ММ.ГГГГ)
  edition?: T;
  copies?: number;
  format?: string;
  pages: number;
  figures?: number;
  refs?: number;
  refPages?: string;
  isbn: string;
  udk?: string;              // УДК
  udkSource?: T;             // откъде е УДК (по подразбиране COBISS.BG)
  cobissId?: string;
  cobissUrl?: string;
  registries?: { label: T; url: string }[]; // други регистри (напр. booksinprint.bg)
  ebook?: boolean;           // електронно издание (CD) — за JSON-LD bookFormat
  reviewers?: T[];
  summary: T;                // кратко описание (вашият ред)
  abstract: T;               // анотация
  toc: { t: T; p: number }[];
  banner: string;            // голямо изображение (jpg)
  bannerSmall: string;       // за социални мрежи (og:image)
  bannerPdf: string;         // банерът като PDF с активни връзки
  bannerAlt: T;
}

export const books: BookPage[] = [
  {
    slug: 'gyros',
    title: 'Жироскопи и инерциални навигационни системи',
    tr: 'Gyroscopes and Inertial Navigation Systems',
    kind: { bg: 'Монография', en: 'Monograph' },
    hab: {
      bg: 'Хабилитационен труд в процедурата пред ВАК за научното звание „доцент“ (2001 г.)',
      en: 'Habilitation work in the procedure before the Higher Attestation Commission (VAK) for the academic rank of Associate Professor (2001)',
    },
    authorId: 'madzharov',
    authorFull: { bg: 'Анастас Николов Маджаров', en: 'Anastas Nikolov Madzharov' },
    authorOnBook: { bg: 'инж. Анастас Николов Маджаров, д-р', en: 'Eng. Anastas Nikolov Madzharov, PhD' },
    publisher: {
      bg: 'Министерство на отбраната, Висше военновъздушно училище „Георги Бенковски“',
      en: 'Ministry of Defence, “Georgi Benkovski” Higher Air Force School',
    },
    place: { bg: 'Долна Митрополия', en: 'Dolna Mitropolia, Bulgaria' },
    year: 2000,
    printed: '27.09.2000',
    edition: { bg: 'първо', en: 'first' },
    copies: 100,
    format: '70×100/16',
    pages: 422,
    figures: 156,
    refs: 67,
    refPages: '414–417',
    isbn: '954-713-046-3',
    udk: '629.7.05(075.8)',
    cobissId: '1036253924',
    cobissUrl: 'https://plus-legacy.cobiss.net/cobiss/bg/bg/bib/1036253924',
    reviewers: [
      { bg: 'доц. инж. Димчо Георгиев Ванчев, д-р', en: 'Assoc. Prof. Eng. Dimcho Georgiev Vanchev, PhD' },
      { bg: 'доц. инж. Владимир Светославов Савов, д-р', en: 'Assoc. Prof. Eng. Vladimir Svetoslavov Savov, PhD' },
    ],
    summary: {
      bg: 'Монография. Хабилитационен труд (ВАК, 2001). Изд. на МО, ВВВУ „Георги Бенковски“, Д. Митрополия, 2000, 422 с., библиография с. 414–417, ISBN 954-713-046-3.',
      en: 'Monograph. Habilitation work (Higher Attestation Commission, VAK, 2001). Ministry of Defence, “Georgi Benkovski” Higher Air Force School, Dolna Mitropolia, 2000, 422 pp., references pp. 414–417, ISBN 954-713-046-3.',
    },
    abstract: {
      bg: 'Изложена е приложната теория на жироскопа. Разгледана е физическата същност и принципът на действие на механични и оптични жироскопи, използвани в жиростабилизирани платформи и навигационни системи. Теорията на автономната инерциална навигация е изведена с уточняване на математически модели за геометричната форма на Земята и нейното гравитационно поле. Разглеждат се алгоритми за функциониране на авиационни инерциални навигационни системи, непритежаващи методически грешки.',
      en: 'The applied theory of the gyroscope is presented. The physical principles and operation of mechanical and optical gyroscopes used in gyrostabilised platforms and navigation systems are examined. The theory of autonomous inertial navigation is derived with refined mathematical models of the Earth’s shape and gravitational field. Algorithms for aviation inertial navigation systems free of methodical errors are considered.',
    },
    toc: [
      { t: { bg: 'Въведение', en: 'Introduction' }, p: 3 },
      { t: { bg: 'Глава първа: Матрични диференциални уравнения, описващи въртене на твърдо тяло', en: 'Chapter 1: Matrix differential equations describing rigid-body rotation' }, p: 5 },
      { t: { bg: 'Глава втора: Основи на теорията на жироскопа', en: 'Chapter 2: Fundamentals of gyroscope theory' }, p: 47 },
      { t: { bg: 'Глава трета: Лазерни жироскопи', en: 'Chapter 3: Laser gyroscopes' }, p: 157 },
      { t: { bg: 'Глава четвърта: Форма на Земята и основни навигационни координатни системи', en: 'Chapter 4: The shape of the Earth and basic navigation coordinate systems' }, p: 217 },
      { t: { bg: 'Глава пета: Изчисляване на координатите на самолет по методите за изчисляване на изминат път', en: 'Chapter 5: Computing aircraft coordinates by dead-reckoning methods' }, p: 266 },
      { t: { bg: 'Глава шеста: Теория на инерциалната навигация', en: 'Chapter 6: Theory of inertial navigation' }, p: 298 },
      { t: { bg: 'Литература', en: 'References' }, p: 414 },
      { t: { bg: 'Съдържание', en: 'Contents' }, p: 418 },
    ],
    banner: '/docs/books/gyros-banner.jpg',
    bannerSmall: '/docs/books/gyros-banner-1200.jpg',
    bannerPdf: '/docs/books/gyros-banner.pdf',
    bannerAlt: {
      bg: 'Банер на монографията „Жироскопи и инерциални навигационни системи“ (А. Н. Маджаров, ВВВУ „Георги Бенковски“, 2000, ISBN 954-713-046-3) с чертежа от корицата',
      en: 'Banner of the monograph “Gyroscopes and Inertial Navigation Systems” (A. N. Madzharov, Georgi Benkovski Higher Air Force School, 2000, ISBN 954-713-046-3) with the cover drawing',
    },
  },
  {
    slug: 'GPS2000',
    title: 'Структура и приложение на глобалните навигационни системи NAVSTAR и ГЛОНАСС',
    tr: 'Structure and Applications for Global Navigation Systems NAVSTAR and GLONASS',
    kind: { bg: 'Монография', en: 'Monograph' },
    kindNote: {
      bg: 'Монография в съавторство: глави втора (NAVSTAR) и трета (ГЛОНАСС) — А. Н. Маджаров; глава първа — П. Ц. Тодоров.',
      en: 'Co-authored monograph: chapters two (NAVSTAR) and three (GLONASS) by A. N. Madzharov; chapter one by P. Ts. Todorov.',
    },
    authorId: 'madzharov',
    authorFull: { bg: 'Анастас Николов Маджаров', en: 'Anastas Nikolov Madzharov' },
    coauthors: [{ bg: 'Пламен Цветанов Тодоров', en: 'Plamen Tsvetanov Todorov' }],
    authorOnBook: { bg: 'инж. Анастас Николов Маджаров, д-р', en: 'Eng. Anastas Nikolov Madzharov, PhD' },
    publisher: {
      bg: 'Министерство на отбраната, Висше военновъздушно училище „Георги Бенковски“ (печат: Военно издателство, София)',
      en: 'Ministry of Defence, “Georgi Benkovski” Higher Air Force School (printed by the Military Publishing House, Sofia)',
    },
    place: { bg: 'Долна Митрополия', en: 'Dolna Mitropolia, Bulgaria' },
    year: 2000,
    printed: '17.12.1999',
    edition: { bg: 'първо', en: 'first' },
    copies: 150,
    format: '60×90/16',
    pages: 191,
    isbn: '954-713-042-0',
    udk: '629.7.052/054.08:629.783',
    udkSource: { bg: 'по книгата', en: 'as printed in the book' },
    cobissId: '52246280',
    cobissUrl: 'https://plus.cobiss.net/cobiss/bg/bg/data/cobib/52246280',
    registries: [{ label: { bg: 'Национален регистър на издаваните книги', en: 'National Register of Published Books' }, url: 'http://booksinprint.bg/Publication/Details/7bb58acb-cf7d-4d84-86cd-a6ea6ace1fa4' }],
    reviewers: [
      { bg: 'доц. инж. Борис Тотков Пеловски, д-р', en: 'Assoc. Prof. Eng. Boris Totkov Pelovski, PhD' },
      { bg: 'доц. инж. Венцислав Илиев Иванов, д-р', en: 'Assoc. Prof. Eng. Ventsislav Iliev Ivanov, PhD' },
    ],
    summary: {
      bg: 'Монография. А. Н. Маджаров, П. Ц. Тодоров. Изд. на МО, ВВВУ „Георги Бенковски“, Д. Митрополия, 2000, 191 с., ISBN 954-713-042-0.',
      en: 'Monograph. A. N. Madzharov, P. Ts. Todorov. Ministry of Defence, “Georgi Benkovski” Higher Air Force School, Dolna Mitropolia, 2000, 191 pp., ISBN 954-713-042-0.',
    },
    abstract: {
      bg: 'Разгледани са структурата и сигналите на двете глобални радионавигационни системи NAVSTAR и ГЛОНАСС. В уводната първа глава е направен преглед и класификация на типовете приемници и са дадени препоръки за избор според предназначението, цената и качеството. Двете следващи глави на книгата са построени по идентична схема. Това позволява читателят да сравнява и прави аналогия между двете навигационни системи. Изяснен е проблемът при съвместното им използване за получаване на единно време. Книгата е предназначена за първоначално запознаване с принципите и използването на глобалната радионавигация.',
      en: 'The structure and signals of the two global radio navigation systems, NAVSTAR and GLONASS, are examined. The introductory first chapter reviews and classifies receiver types and gives recommendations for choosing a receiver by purpose, price and quality. The next two chapters follow an identical scheme, which lets the reader compare the two navigation systems and draw analogies between them. The problem of using them together to obtain a common time scale is clarified. The book is intended as a first introduction to the principles and use of global radio navigation.',
    },
    toc: [
      { t: { bg: 'Глава първа: Сфери на приложение на глобалните спътникови навигационни системи', en: 'Chapter 1: Fields of application of global satellite navigation systems' }, p: 3 },
      { t: { bg: 'Глава втора: Спътникова система за глобална навигация NAVSTAR', en: 'Chapter 2: The NAVSTAR global satellite navigation system' }, p: 37 },
      { t: { bg: 'Глава трета: Спътникова система за глобална навигация ГЛОНАСС', en: 'Chapter 3: The GLONASS global satellite navigation system' }, p: 110 },
      { t: { bg: 'Приложение № 1: Списък на термини и съкращения', en: 'Appendix 1: Terms and abbreviations' }, p: 182 },
      { t: { bg: 'Съдържание', en: 'Contents' }, p: 188 },
    ],
    banner: '/docs/books/GPS2000-banner.jpg',
    bannerSmall: '/docs/books/GPS2000-banner-1200.jpg',
    bannerPdf: '/docs/books/GPS2000-banner.pdf',
    bannerAlt: {
      bg: 'Банер на монографията „Структура и приложение на глобалните навигационни системи NAVSTAR и ГЛОНАСС“ (А. Н. Маджаров, П. Ц. Тодоров, ВВВУ „Георги Бенковски“, 2000, ISBN 954-713-042-0) с титулната страница',
      en: 'Banner of the monograph “Structure and Applications for Global Navigation Systems NAVSTAR and GLONASS” (A. N. Madzharov, P. Ts. Todorov, Georgi Benkovski Higher Air Force School, 2000, ISBN 954-713-042-0) with the title page',
    },
  },
  {
    slug: 'GPS2013',
    title: 'Структура и приложение на спътниковите навигационни системи',
    tr: 'Structure and Application of Satellite Navigation Systems',
    kind: { bg: 'Учебник', en: 'Textbook' },
    kindNote: {
      bg: 'Университетски учебник за дистанционно обучение, разработен по проект BG051PO001-4.3.04-0016 „Нови възможности за учене през целия живот чрез модернизация на Център за дистанционно обучение към НВУ „Васил Левски“, ОП „Развитие на човешките ресурси“, съфинансирана от Европейския социален фонд.',
      en: 'University textbook for distance learning, developed under project BG051PO001-4.3.04-0016 “New opportunities for lifelong learning through modernisation of the Distance Learning Centre at the Vasil Levski National Military University”, Operational Programme “Human Resources Development”, co-financed by the European Social Fund.',
    },
    authorId: 'madzharov',
    authorFull: { bg: 'Анастас Николов Маджаров', en: 'Anastas Nikolov Madzharov' },
    authorOnBook: { bg: 'Анастас Николов Маджаров', en: 'Anastas Nikolov Madzharov' },
    publisher: { bg: 'Издателски комплекс на НВУ „Васил Левски“', en: 'Publishing Complex of the Vasil Levski National Military University' },
    place: { bg: 'Велико Търново', en: 'Veliko Tarnovo, Bulgaria' },
    year: 2013,
    edition: { bg: 'първо', en: 'first' },
    format: 'CD',
    pages: 177,
    isbn: '978-954-753-168-0',
    ebook: true,
    registries: [{ label: { bg: 'Национален регистър на издаваните книги', en: 'National Register of Published Books' }, url: 'http://booksinprint.bg/Publication/Details/80a6ff8c-2b60-4e2a-82dd-05a0f76ff4d0' }],
    reviewers: [
      { bg: 'доц. д-р Румен Георгиев', en: 'Assoc. Prof. Rumen Georgiev, PhD' },
      { bg: 'доц. д-р Николай Пътев', en: 'Assoc. Prof. Nikolay Patev, PhD' },
    ],
    summary: {
      bg: 'Учебник за дистанционно обучение. Издателски комплекс на НВУ „Васил Левски“, В. Търново, 2013, 177 с., ISBN 978-954-753-168-0.',
      en: 'Textbook for distance learning. Publishing Complex of the Vasil Levski National Military University, Veliko Tarnovo, 2013, 177 pp., ISBN 978-954-753-168-0.',
    },
    abstract: {
      bg: 'Учебникът разглежда сферите на приложение на глобалните спътникови навигационни системи във въздушната, морската и сухопътната навигация и избора на GPS приемник; структурата, радиосигналите и определянето на местоположение, скорост и време в системата NAVSTAR GPS, както и използваните геодезични параметри; руската система ГЛОНАСС; европейските Galileo и EGNOS и китайската BeiDou/Compass.',
      en: 'The textbook covers the fields of application of global satellite navigation systems in air, sea and land navigation and the choice of a GPS receiver; the structure, radio signals and determination of position, velocity and time in the NAVSTAR GPS system, together with the geodetic parameters used; the Russian GLONASS system; the European Galileo and EGNOS and the Chinese BeiDou/Compass.',
    },
    toc: [
      { t: { bg: 'Предговор', en: 'Preface' }, p: 4 },
      { t: { bg: 'Глава първа: Сфери на приложение на глобалните спътникови навигационни системи', en: 'Chapter 1: Fields of application of global satellite navigation systems' }, p: 5 },
      { t: { bg: 'Глава втора: Спътникова система за глобална навигация NAVSTAR', en: 'Chapter 2: The NAVSTAR global satellite navigation system' }, p: 40 },
      { t: { bg: 'Глава трета: Спътникова система за глобална навигация ГЛОНАСС', en: 'Chapter 3: The GLONASS global satellite navigation system' }, p: 117 },
      { t: { bg: 'Глава четвърта: Други системи за спътникова навигация (Galileo, EGNOS, BeiDou/Compass)', en: 'Chapter 4: Other satellite navigation systems (Galileo, EGNOS, BeiDou/Compass)' }, p: 143 },
    ],
    banner: '/docs/books/GPS2013-banner.jpg',
    bannerSmall: '/docs/books/GPS2013-banner-1200.jpg',
    bannerPdf: '/docs/books/GPS2013-banner.pdf',
    bannerAlt: {
      bg: 'Банер на учебника „Структура и приложение на спътниковите навигационни системи“ (А. Н. Маджаров, НВУ „Васил Левски“, 2013, ISBN 978-954-753-168-0) с титулната страница',
      en: 'Banner of the textbook “Structure and Application of Satellite Navigation Systems” (A. N. Madzharov, Vasil Levski National Military University, 2013, ISBN 978-954-753-168-0) with the title page',
    },
  },
];

export const bookSlug = (b: BookPage) => `publications/books/${b.slug}`;
export const bookBySlug = (s: string) => books.find((b) => b.slug === s);
export type { Lang };
