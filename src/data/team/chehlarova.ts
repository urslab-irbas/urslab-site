// Профил: chehlarova
// Редактирайте само стойностите в кавички. Двата езика (bg / en) са задължителни.
// orcid: само номерът, напр. '0000-0002-1234-5678'. photo: файл в public/images/team/
import type { Member } from './types';

const member: Member = {
  id: 'chehlarova',
  github: 'nedachehlarova',
  name: { bg: 'Неда В. Чехларова', en: 'Neda V. Chehlarova' },
  title: { bg: 'доц. д-р', en: 'Assoc. Prof. Dr.' },
  orcid: '0000-0001-6045-1709',
  scholar: 'https://scholar.google.com/citations?user=8zr4pgwAAAAJ',
  interests: {
    bg: ['Адитивни технологии (3D печат)', 'STEAM обучение', 'Електронно обучение'],
    en: ['Additive manufacturing (3D printing)', 'STEAM education', 'E-learning'],
  },
};

export default member;
