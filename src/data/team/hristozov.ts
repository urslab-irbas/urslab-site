// Профил: hristozov
// Редактирайте само стойностите в кавички. Двата езика (bg / en) са задължителни.
// orcid: само номерът, напр. '0000-0002-1234-5678'. photo: файл в public/images/team/
import type { Member } from './types';

const member: Member = {
  id: 'hristozov',
  name: { bg: 'Стефан И. Христозов', en: 'Stefan I. Hristozov' },
  title: { bg: 'гл. ас. д-р инж.', en: 'Chief Assist. Prof. Dr. Eng.' },
  orcid: '0000-0001-9845-1202',
  email: 'st.hristozov@ir.bas.bg',
  interests: {
    bg: ['Инерциална навигация', 'Геодезически изчисления в полет'],
    en: ['Inertial navigation', 'In-flight geodetic computation'],
  },
};

export default member;
