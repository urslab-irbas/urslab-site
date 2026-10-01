// Профил: aleksandrov
// Редактирайте само стойностите в кавички. Двата езика (bg / en) са задължителни.
// orcid: само номерът, напр. '0000-0002-1234-5678'. photo: файл в public/images/team/
import type { Member } from './types';

const member: Member = {
  id: 'aleksandrov',
  name: { bg: 'Александър К. Александров', en: 'Alexander K. Alexandrov' },
  title: { bg: 'доц. д.н. инж.', en: 'Assoc. Prof. DSc Eng.' },
  orcid: '',
  researchgate: 'https://www.researchgate.net/profile/Alexander-Alexandrov-19',
  interests: {
    bg: ['Безжични сензорни мрежи и сигурност', 'Киберсигурност и мониторинг на мрежи', 'Изкуствен интелект и машинно обучение', 'Наземни роботизирани платформи (UGV)'],
    en: ['Wireless sensor networks & security', 'Cybersecurity & network monitoring', 'AI & machine learning', 'Unmanned ground vehicles (UGV)'],
  },
};

export default member;
