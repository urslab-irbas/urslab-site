// Годишни страници с публикации (раздел „Архив“ в „Публикации“). Нова година: data-файл + ред тук + 2 файла в src/pages.
import { archive as archive2022, type ArchivePub } from './archive2022';
import { archive2025 } from './archive2025';
import { archive2026 } from './archive2026';

type L = { bg: string; en: string };
export interface ArchivePage { key: string; slug: string; title: L; source?: L; items: ArchivePub[] }

const BAS: L = {
  bg: 'Източник: отчет на БАН „Всички публикации – публикувани“ (звено ИР), 02.10.2026. „Дял ИР“ = сума от процента автори от Института по роботика.',
  en: 'Source: BAS report “All publications – published” (IR unit), 2 Oct 2026. “IR share” = sum of the percentage of authors from the Institute of Robotics.',
};

export const archivePages: ArchivePage[] = [
  { key: '2026', slug: 'publications/2026', title: { bg: 'Публикации 2026 г.', en: 'Publications 2026' }, source: BAS, items: archive2026 },
  { key: '2025', slug: 'publications/2025', title: { bg: 'Публикации 2025 г.', en: 'Publications 2025' }, source: BAS, items: archive2025 },
  { key: '2022-2024', slug: 'publications/2022-2024', title: { bg: 'Публикации 2022 – 2024 г.', en: 'Publications 2022 – 2024' }, items: archive2022 },
];
