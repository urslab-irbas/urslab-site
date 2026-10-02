// Общо съдържание: навигация, проекти, услуги, направления.
type L = { bg: string; en: string };

export const langs = ['bg', 'en'] as const;
export type Lang = (typeof langs)[number];

export const nav: { slug: string; label: L }[] = [
  { slug: '', label: { bg: 'Начало', en: 'Home' } },
  { slug: 'research', label: { bg: 'Изследвания', en: 'Research' } },
  { slug: 'team', label: { bg: 'Състав', en: 'Team' } },
  { slug: 'projects', label: { bg: 'Проекти', en: 'Projects' } },
  { slug: 'publications', label: { bg: 'Публикации', en: 'Publications' } },
  { slug: 'services', label: { bg: 'Услуги', en: 'Services' } },
  { slug: 'contact', label: { bg: 'Контакти', en: 'Contact' } },
];

export const site = {
  name: { bg: 'Лаборатория „Безпилотни роботизирани системи“', en: 'Unmanned Robotic Systems Laboratory' },
  short: { bg: 'БРС', en: 'URSlab' },
  institute: { bg: 'Институт по роботика — БАН', en: 'Institute of Robotics — Bulgarian Academy of Sciences' },
  tagline: {
    bg: 'Автономна навигация, авионика и безпилотни летателни системи — от математическия модел до полета.',
    en: 'Autonomous navigation, avionics and unmanned aircraft systems — from the mathematical model to the flight.',
  },
  intro: {
    bg: [
      'Лабораторията „Безпилотни роботизирани системи“ работи в областите авиационни комплекси, авионика, комуникационни и радарни технологии. Тя подпомага научните секции на Института по роботика в изследванията им в интерес на сигурността и отбраната, главно за роботизирани системи.',
      'Лабораторията разполага със собствени прототипи на дистанционно управляеми летателни апарати с повишена продължителност на полета и товароносимост и съпровожда докторски програми за иновативни безпилотни системи с автономно програмно управление, включително с елементи на изкуствен интелект.',
    ],
    en: [
      'The Unmanned Robotic Systems Laboratory works in aviation complexes, avionics, and communication and radar technologies. It supports the scientific departments of the Institute of Robotics in research conducted in the interests of security and defence, mainly for robotic systems.',
      'The laboratory has its own prototypes of remotely piloted aircraft with extended endurance and increased payload, and supports doctoral programmes on innovative unmanned systems with autonomous program control, including elements of artificial intelligence.',
    ],
  },
  address: { bg: 'ул. „Акад. Г. Бончев“, бл. 2, 1113 София', en: 'Acad. G. Bonchev St., Bl. 2, 1113 Sofia, Bulgaria' },
  email: 'office@ir.bas.bg',
  phones: ['+359 2 870 3361', '+359 2 979 3230'],
};

// tags: кои етикети от publications.ts спадат към направлението (за връзката „Направление → Публикации“).
export const areas: { key: string; title: L; text: L; tags: string[] }[] = [
  {
    key: 'nav',
    tags: ['navigation'],
    title: { bg: 'Автономна навигация', en: 'Autonomous navigation' },
    text: {
      bg: 'Алгоритми за INS/GNSS, полет по ортодромии и координирани завои върху елипсоида WGS 84, планиране на маршрути в реално време.',
      en: 'INS/GNSS algorithms, orthodromic flight and coordinated turns on the WGS 84 ellipsoid, real-time route planning.',
    },
  },
  {
    key: 'geo',
    tags: ['geodesy', 'gravity'],
    title: { bg: 'Геодезия и гравитация', en: 'Geodesy & gravity' },
    text: {
      bg: 'Точни аналитични модели на гравитационното поле и на разликата между геоцентрична и геодезическа ширина за бордови изчисления.',
      en: 'Precise analytical models of the gravity field and of the geocentric–geodetic latitude difference for on-board computation.',
    },
  },
  {
    key: 'avionics',
    tags: ['ins', 'avionics'],
    title: { bg: 'Авионика и платформи', en: 'Avionics & platforms' },
    text: {
      bg: 'Прототипи на БЛА с повишена продължителност на полета и товароносимост; бордови системи за управление (C2) на SoC.',
      en: 'UAV prototypes with extended endurance and payload; SoC-based on-board command and control (C2) systems.',
    },
  },
  {
    key: 'comm',
    tags: [],
    title: { bg: 'Комуникации и радари', en: 'Communications & radar' },
    text: {
      bg: 'Комуникационни и радарни технологии за роботизирани системи в интерес на сигурността и отбраната.',
      en: 'Communication and radar technologies for robotic systems in the interests of security and defence.',
    },
  },
  {
    key: 'sec',
    tags: ['security'],
    title: { bg: 'Сигурност на данните', en: 'Data security' },
    text: {
      bg: 'Конструктивни модели за проектиране на системи за защита на данни в безпилотни и киберфизични системи.',
      en: 'Constructive models for designing data-protection systems in unmanned and cyber-physical systems.',
    },
  },
  {
    key: 'safety',
    tags: [],
    title: { bg: 'Безопасност на полетите', en: 'Flight safety & regulation' },
    text: {
      bg: 'Оценка на риска за операции в специфична категория (SORA) и обучение на пилоти на БЛС по Регламент (ЕС) 2019/947.',
      en: 'Risk assessment for specific-category operations (SORA) and UAS pilot training under Regulation (EU) 2019/947.',
    },
  },
];

export const projects: { title: L; funder: L; period: string; text: L; link?: L }[] = [
  {
    title: { bg: 'Национална научна програма „Сигурност и отбрана“', en: 'National Scientific Program “Security and Defence”' },
    funder: { bg: 'МОН, споразумение Д01-74/19.05.2022', en: 'Ministry of Education and Science, grant D01-74/19.05.2022' },
    period: '2022 – 2025',
    text: {
      bg: 'Изследвания в областта на автономната навигация, геодезическите модели за бордови изчисления и безпилотните системи.',
      en: 'Research on autonomous navigation, geodetic models for on-board computation and unmanned systems.',
    },
    link: { bg: 'https://ir.bas.bg/projects/NSPSD/nspsd.pdf', en: 'https://ir.bas.bg/projects/NSPSD/nspsd_en.pdf' },
  },
];

export const services: { title: L; text: L; link: string }[] = [
  {
    title: {
      bg: 'Оценка на риска при операции в специфична категория с БЛС',
      en: 'Risk assessment for specific-category UAS operations',
    },
    text: {
      bg: 'Операциите в специфична категория изискват предварително разрешение от ГД ГВА. Изготвяме оценката на риска, необходима за разрешението.',
      en: 'Specific-category operations require prior authorisation from the Civil Aviation Administration. We prepare the risk assessment required for it.',
    },
    link: 'https://s2b.nacid.bg/suppliers/39/offerings/472',
  },
  {
    title: {
      bg: 'Курсове за повишаване на квалификацията на пилоти на БЛС',
      en: 'Advanced training courses for UAS pilots',
    },
    text: {
      bg: 'Обхваща трите основни стълба по Регламент (ЕС) 2019/947 и завършва със сертификат за правоуправление.',
      en: 'Covers the three pillars required by Regulation (EU) 2019/947 and ends with a remote-pilot certificate.',
    },
    link: 'https://s2b.nacid.bg/suppliers/39/offerings/1602',
  },
];

export const t = {
  switchTo: { bg: 'English', en: 'Български' },
  learnMore: { bg: 'Научете повече', en: 'Learn more' },
  areasTitle: { bg: 'Научни направления', en: 'Research areas' },
  latestPubs: { bg: 'Последни публикации', en: 'Latest publications' },
  allPubs: { bg: 'Всички публикации', en: 'All publications' },
  team: { bg: 'Състав', en: 'Team' },
  gallery: { bg: 'Галерия', en: 'Gallery' },
  all: { bg: 'Всички', en: 'All' },
  byArea: { bg: 'По направление', en: 'By research area' },
  byTopic: { bg: 'По тема', en: 'By topic' },
  pubsCount: { bg: 'публикации', en: 'publications' },
  pubsCount1: { bg: 'публикация', en: 'publication' },
  noPubsYet: { bg: 'Публикации предстоят', en: 'Publications forthcoming' },
  noneFound: { bg: 'Няма публикации по този филтър.', en: 'No publications match this filter.' },
  status: {
    published: { bg: 'публикувана', en: 'published' },
    'in-press': { bg: 'под печат', en: 'in press' },
    submitted: { bg: 'подадена', en: 'submitted' },
  },
  archive: { bg: 'Архив', en: 'Archive' },
  funding: { bg: 'Финансиране', en: 'Funding' },
  contactTitle: { bg: 'Как да ни откриете', en: 'How to find us' },
  demoTitle: { bg: 'Координиран завой по клотоида', en: 'Coordinated turn along a clothoid' },
  demoText: {
    bg: 'Интерактивна илюстрация: маршрут през точки с плавни завои, при които кривината се мени линейно по дължината на дъгата — без скок в страничното ускорение при смяна на ортодромията. Преместете точките с мишката.',
    en: 'Interactive illustration: a route through waypoints with smooth turns whose curvature changes linearly with arc length — no jump in lateral acceleration when switching orthodromes. Drag the waypoints.',
  },
  rights: { bg: 'Всички права запазени.', en: 'All rights reserved.' },
};

// Брой публикации в направление (по етикетите му)
import { publications as _pubs } from './publications';
export function areaPubCount(tags: string[]): number {
  return _pubs.filter((p) => p.tags.some((g) => tags.includes(g))).length;
}
