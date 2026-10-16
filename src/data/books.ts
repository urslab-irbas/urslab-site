// Отделни страници за монографии и книги (/publications/books/<slug>/ и /en/publications/books/<slug>/).
// Целта: търсачките да виждат пълните данни за книгата (текст на страницата, JSON-LD Book,
// мета данни за Google Scholar) и големия банер. Записът в годишния списък (archiveEarlier.ts)
// сочи към страницата с полето `page` (заглавието е връзката).
// Данните са от самата книга (с. 2, 3–4, 414–422) и от COBISS.BG.
import type { Lang } from './content';

type T = { bg: string; en: string };

export interface BookPage {
  slug: string;              // адрес: publications/books/<slug>
  title: string;             // заглавие на езика на книгата
  tr: string;                // превод на заглавието
  kind: T;                   // вид (монография …)
  hab?: T;                   // хабилитационен труд — процедура, година
  authorId: string;          // ключ в src/data/team
  authorFull: T;             // името, както е в книгата
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
  udk: string;               // УДК по COBISS
  cobissId: string;
  cobissUrl: string;
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
];

export const bookSlug = (b: BookPage) => `publications/books/${b.slug}`;
export const bookBySlug = (s: string) => books.find((b) => b.slug === s);
export type { Lang };
