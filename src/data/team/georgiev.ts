// Профил: georgiev
// Редактирайте само стойностите в кавички. Двата езика (bg / en) са задължителни.
// orcid: само номерът, напр. '0000-0002-1234-5678'. photo: файл в public/images/team/
import type { Member } from './types';

const member: Member = {
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
};

export default member;
