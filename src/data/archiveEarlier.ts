// Публикации преди 2022 г. (монографии и учебници от стария PDF publ1.pdf; доклади, отразени в ORCID). Форматът е описан в archive2022.ts.
import type { ArchivePub } from './archive2022';

export const archiveEarlier: ArchivePub[] = [
  {
    year: 2019, cat: 'nrs', team: ['madzharov'], tags: ['software'], note: 'НАЦИД, Национален референтен списък, ID 1708 (2015–2021)',
    authors: 'Madzharov, A. N.',
    title: 'Technical implementation of a reporting system and its workflows',
    venue: 'Proceedings of the International Scientific Conference “Defense Technologies” DefTech 2019, Faculty of Artillery, Air Defense and Communication and Information Systems, “Vasil Levski” National Military University, Shumen, Bulgaria, pp. 316–322',
    issn: '2367-7902',
    url: 'https://dtf.aadcf.nvu.bg/wp-content/uploads/2022/10/DTF_2019.pdf',
  },
  {
    year: 2004, cat: 'idx', team: ['madzharov'], tags: ['navigation', 'gravity', 'ins'],
    authors: 'Madzharov, A. N., Panova, P. V., & Getsov, P. S.',
    title: 'Theoretical research of possibilities for gravitation measurements in motion using the inertial navigation system',
    venue: '55th International Astronautical Congress (IAC 2004), Vancouver, Canada, paper IAC-04-J.P.08',
    doi: '10.2514/6.IAC-04-J.P.08', eid: '2-s2.0-34249112190',
  },
  {
    year: 2000, cat: 'mono', team: ['madzharov'], tags: ['navigation'],
    authors: 'Маджаров, А.',
    title: 'Жироскопи и инерциални навигационни системи',
    tr: 'Gyroscopes and Inertial Navigation Systems',
    venue: 'Д. Митрополия: ВВВУ „Георги Бенковски“, 422 с.',
    isbn: '954-713-046-3',
  },
  {
    year: 2013, cat: 'book', team: ['madzharov'], tags: ['navigation'],
    authors: 'Маджаров, А.',
    title: 'Структура и приложение на спътниковите навигационни системи',
    tr: 'Structure and Application of Satellite Navigation Systems',
    venue: 'В. Търново: НВУ „Васил Левски“, 177 с.',
    isbn: '978-954-753-168-0',
  },
];
