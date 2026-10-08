// Очаквано индексиране на статиите под печат / подадени: по поредицата или списанието, в което ще излязат.
// Стойностите са последните публикувани в SCImago (SJR за 2025 г.). Показват се като „Очаквано: …“ —
// статиите остават в „Подадени / под печат“, а реалната категория се попълва, когато излязат.
// Нова поредица → нов ред (match — част от името на изданието във venue, без значение главни/малки букви).
import type { ArchCat } from './archive2022';

export const SJR_YEAR = 2025;

// text — вместо SJR/квартил: очакваното за изданието като текст (напр. срок и индексиране на сборник без SJR)
export interface SeriesMetrics { match: RegExp; name: string; cat: ArchCat; sjr?: number; url: string; text?: { bg: string; en: string } }

export const seriesMetrics: SeriesMetrics[] = [
  { match: /journal of data science and intelligent systems|jdsis/i, name: 'Journal of Data Science and Intelligent Systems', cat: 'q1', sjr: 1.035, url: 'https://www.scimagojr.com/journalsearch.php?q=21101346359&tip=sid' },
  { match: /engineering proceedings/i, name: 'Engineering Proceedings (MDPI)', cat: 'q3', sjr: 0.254, url: 'https://www.scimagojr.com/journalsearch.php?q=21101128137&tip=sid' },
  { match: /communications in computer and information science/i, name: 'Communications in Computer and Information Science (Springer)', cat: 'q4', sjr: 0.181, url: 'https://www.scimagojr.com/journalsearch.php?q=17700155007&tip=sid' },
  { match: /studies in systems, decision and control/i, name: 'Studies in Systems, Decision and Control (Springer)', cat: 'q4', sjr: 0.133, url: 'https://www.scimagojr.com/journalsearch.php?q=21100828949&tip=sid' },
  { match: /lecture notes in civil engineering/i, name: 'Lecture Notes in Civil Engineering (Springer)', cat: 'q4', sjr: 0.15, url: 'https://www.scimagojr.com/journalsearch.php?q=21100889404&tip=sid' },
  { match: /lecture notes in networks and systems/i, name: 'Lecture Notes in Networks and Systems (Springer)', cat: 'q4', sjr: 0.165, url: 'https://www.scimagojr.com/journalsearch.php?q=21100901469&tip=sid' },
  { match: /journal of physics: conference series/i, name: 'Journal of Physics: Conference Series (IOP)', cat: 'sjr', sjr: 0.18, url: 'https://www.scimagojr.com/journalsearch.php?q=130053&tip=sid' },
  { match: /icaictsee/i, name: 'ICAICTSEE 2026 — Conference Proceedings (ISSN 2367-7635, 2367-7643)', cat: 'nat', url: 'https://icaictsee.unwe.bg/',
    text: { bg: 'Март 2027 г.: официално публикуване и индексиране на сборника с доклади, индексиран в CEEOL; НАЦИД НРС, ID 4066', en: 'March 2027: official publication and indexing of the proceedings, indexed in CEEOL; NACID NRS, ID 4066' } },
  { match: /aip conference proceedings/i, name: 'AIP Conference Proceedings', cat: 'sjr', sjr: 0.146, url: 'https://www.scimagojr.com/journalsearch.php?q=26916&tip=sid' },
];

export const expectedFor = (venue: string) => seriesMetrics.find((s) => s.match.test(venue));

/** Етикет „Q4 · SJR 0.165“ / „SJR 0.146“ (без квартил) */
export const expectedLabel = (s: SeriesMetrics, lang: 'bg' | 'en' = 'bg') => s.text ? s.text[lang] : `${/^q\d$/.test(s.cat) ? `${s.cat.toUpperCase()} · ` : ''}SJR ${(s.sjr ?? 0).toFixed(3)}`;
