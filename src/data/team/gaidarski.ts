// Профил: gaidarski
// Редактирайте само стойностите в кавички. Двата езика (bg / en) са задължителни.
// orcid: само номерът, напр. '0000-0002-1234-5678'. photo: файл в public/images/team/
import type { Member } from './types';

const member: Member = {
  id: 'gaidarski',
  github: 'ivangaidarski',
  name: { bg: 'Иван К. Гайдарски', en: 'Ivan K. Gaidarski' },
  title: { bg: 'гл. ас. д-р инж.', en: 'Chief Assist. Prof. Dr. Eng.' },
  orcid: '0000-0002-4979-445X',
  email: 'ivangaidarski@ir.bas.bg',
  interests: {
    bg: ['Защита на данни', 'Киберсигурност', 'Навигационни алгоритми'],
    en: ['Data protection systems', 'Cybersecurity', 'Navigation algorithms'],
  },
};

export default member;
