// Профил: madzharov
// Редактирайте само стойностите в кавички. Двата езика (bg / en) са задължителни.
// orcid: само номерът, напр. '0000-0002-1234-5678'. photo: файл в public/images/team/
import type { Member } from './types';

const member: Member = {
  id: 'madzharov',
  github: 'urslab-irbas',
  name: { bg: 'Анастас Н. Маджаров', en: 'Anastas N. Madzharov' },
  title: { bg: 'доц. д-р инж.', en: 'Assoc. Prof. Dr. Eng.' },
  role: { bg: 'Ръководител на лабораторията', en: 'Head of Laboratory' },
  orcid: '0000-0002-6282-617X',
  email: 'a.madzharov@ir.bas.bg',
  interests: {
    bg: ['Автономна навигация на БЛА', 'INS/GNSS интеграция', 'Елипсоидна геодезия', 'Модели на гравитационното поле'],
    en: ['Autonomous UAV navigation', 'INS/GNSS integration', 'Ellipsoidal geodesy', 'Gravity field models'],
  },
};

export default member;
