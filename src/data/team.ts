// Състав на лабораторията / Laboratory staff
// За да добавите човек: копирайте един запис и попълнете полетата.
// orcid: само номерът (0000-0000-0000-0000); празно = не се показва.
// photo: файл в public/images/team/ (напр. "madzharov.jpg"); празно = инициали.

export interface Member {
  id: string;
  name: { bg: string; en: string };
  title: { bg: string; en: string };
  role?: { bg: string; en: string };
  orcid?: string;
  email?: string;
  scholar?: string;
  researchgate?: string;
  dissertation?: string;
  thesis?: { bg: string; en: string };
  photo?: string;
  interests?: { bg: string[]; en: string[] };
}

export const team: Member[] = [
  {
    id: 'madzharov',
    name: { bg: 'Анастас Н. Маджаров', en: 'Anastas N. Madzharov' },
    title: { bg: 'доц. д-р инж.', en: 'Assoc. Prof. Dr. Eng.' },
    role: { bg: 'Ръководител на лабораторията', en: 'Head of Laboratory' },
    orcid: '0000-0002-6282-617X',
    email: 'a.madzharov@ir.bas.bg',
    interests: {
      bg: ['Автономна навигация на БЛА', 'INS/GNSS интеграция', 'Елипсоидна геодезия', 'Модели на гравитационното поле'],
      en: ['Autonomous UAV navigation', 'INS/GNSS integration', 'Ellipsoidal geodesy', 'Gravity field models'],
    },
  },
  {
    id: 'aleksandrov',
    name: { bg: 'Александър К. Александров', en: 'Alexander K. Alexandrov' },
    title: { bg: 'доц. д.н. инж.', en: 'Assoc. Prof. DSc Eng.' },
    orcid: '',
    researchgate: 'https://www.researchgate.net/profile/Alexander-Alexandrov-19',
    interests: {
      bg: ['Безжични сензорни мрежи и сигурност', 'Киберсигурност и мониторинг на мрежи', 'Изкуствен интелект и машинно обучение', 'Наземни роботизирани платформи (UGV)'],
      en: ['Wireless sensor networks & security', 'Cybersecurity & network monitoring', 'AI & machine learning', 'Unmanned ground vehicles (UGV)'],
    },
  },
  {
    id: 'georgiev',
    name: { bg: 'Румен Ж. Георгиев', en: 'Rumen Zh. Georgiev' },
    title: { bg: 'доц. д-р инж.', en: 'Assoc. Prof. Dr. Eng.' },
    dissertation: 'https://ras.nacid.bg/dissertation-preview/3566',
    thesis: {
      bg: 'Алгоритмично осигуряване на оптимален функционален контрол на САУ с динамични прагове на откриване',
      en: 'Algorithmic support for optimal functional monitoring of automatic control systems with dynamic detection thresholds',
    },
    interests: {
      bg: ['Вграден бордови контрол и оптимално оценяване', 'Управление с понижена чувствителност към повреди (FTC)', 'Откриване и идентификация на откази (FDI)', 'Пренастройване на САУ след отказ'],
      en: ['On-board built-in monitoring & optimal estimation', 'Fault-tolerant control (FTC)', 'Fault detection & isolation (FDI)', 'Control-system reconfiguration after faults'],
    },
  },
  {
    id: 'gaidarski',
    name: { bg: 'Иван К. Гайдарски', en: 'Ivan K. Gaidarski' },
    title: { bg: 'гл. ас. д-р инж.', en: 'Chief Assist. Prof. Dr. Eng.' },
    orcid: '0000-0002-4979-445X',
    email: 'ivangaidarski@ir.bas.bg',
    interests: {
      bg: ['Защита на данни', 'Киберсигурност', 'Навигационни алгоритми'],
      en: ['Data protection systems', 'Cybersecurity', 'Navigation algorithms'],
    },
  },
  {
    id: 'hristozov',
    name: { bg: 'Стефан И. Христозов', en: 'Stefan I. Hristozov' },
    title: { bg: 'гл. ас. д-р инж.', en: 'Chief Assist. Prof. Dr. Eng.' },
    orcid: '0000-0001-9845-1202',
    email: 'st.hristozov@ir.bas.bg',
    interests: {
      bg: ['Инерциална навигация', 'Геодезически изчисления в полет'],
      en: ['Inertial navigation', 'In-flight geodetic computation'],
    },
  },
  {
    id: 'chehlarova',
    name: { bg: 'Неда В. Чехларова', en: 'Neda V. Chehlarova' },
    title: { bg: 'доц. д-р', en: 'Assoc. Prof. Dr.' },
    orcid: '0000-0001-6045-1709',
    scholar: 'https://scholar.google.com/citations?user=8zr4pgwAAAAJ',
    interests: {
      bg: ['Адитивни технологии (3D печат)', 'STEAM обучение', 'Електронно обучение'],
      en: ['Additive manufacturing (3D printing)', 'STEAM education', 'E-learning'],
    },
  },
];
