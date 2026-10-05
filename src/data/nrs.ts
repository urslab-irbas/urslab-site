// Издания от Националния референтен списък на НАЦИД (https://nrs.nacid.bg/register/search).
// Всяка публикация на сайта, чието издание съвпада с ред тук, автоматично получава:
//   • бележка „НАЦИД НРС, ID …“ и ISSN на изданието;
//   • категория „Национално академично издателство“, ако досега е била „Други бази данни“.
// Ново издание в НРС → нов ред тук (match — част от името на изданието, без значение главни/малки букви).
export interface NrsEntry { id: number; title: string; issn: string; match: RegExp }

export const nrs: NrsEntry[] = [
  { id: 767, title: 'Complex Control Systems', issn: '1310-8255 (print), 2603-4697 (online)', match: /complex control systems/i },
  { id: 1708, title: 'International Scientific Conference “Defense Technologies”', issn: '2367-7902', match: /defense technologies|deftech/i },
];

export const nrsFor = (venue: string) => nrs.find((n) => n.match.test(venue));
