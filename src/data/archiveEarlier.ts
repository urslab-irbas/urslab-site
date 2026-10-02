// Публикации преди 2022 г. (монографии и учебници от стария PDF publ1.pdf). Форматът е описан в archive2022.ts.
import type { ArchivePub } from './archive2022';

export const archiveEarlier: ArchivePub[] = [
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
