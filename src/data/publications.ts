// Публикации / Publications
// ТЕКУЩ списък: подадени / под печат (status 'submitted' | 'in-press') — показват се на страница „Публикации“.
// Когато статия излезе: status: 'published' + doi → при следващото обновяване тя минава автоматично
// в годишната страница под „Архив“ според year (виж archivePages.ts) и изчезва от текущия списък.
// Нова публикация: добавете запис най-отгоре. authors — както са в статията (латиница).
// status: 'published' | 'in-press' | 'submitted'
// Ключовите думи (tags) се използват за филтрите на страницата.

export interface Publication {
  year: number;
  title: string;
  authors: string[];
  authorsEn?: string[]; // на латиница за английската версия (когато authors са на кирилица)
  venue: string;
  status: 'published' | 'in-press' | 'submitted';
  doi?: string;
  doiOff?: boolean; // DOI-то не е активно в doi.org: показва се като текст
  url?: string;
  abstract?: string;
  tags: string[];
  funding?: string;
  fundVia?: 'conf' | 'report'; // виж nspsdRefs.ts
}

const NSPDS = 'NSP DS, MES grant D01-74/19.05.2022';

export const publications: Publication[] = [
  {
    year: 2026,
    title: 'URSlab Website and Information System for Reporting the Publication Activity of a Scientific Department of BAS: Source Code (v1.1.0)',
    authors: ['A. Madzharov'],
    venue: 'Zenodo — Software (files with restricted access)',
    status: 'published',
    doi: '10.5281/zenodo.23111566',
    funding: NSPDS,
    tags: ['software', 'navigation'],
    abstract:
      'Version 1.1.0 extends the URSlab website into an information system for recording, validating and reporting the publication activity of a scientific department of BAS: yearly publication pages categorised as in the BAS reporting system, combinable filters with a live reporting summary and CSV export, per-member summary reports, and entry of new publications by team members with APA validation, GitHub-based identity and automatic re-validation.',
  },
  {
    year: 2026,
    title: 'URSlab Website and Interactive Coordinated-Turn Model: Source Code (v1.0.0)',
    authors: ['A. Madzharov'],
    venue: 'Zenodo — Software (files with restricted access)',
    status: 'published',
    doi: '10.5281/zenodo.23086274',
    funding: NSPDS,
    tags: ['software', 'navigation'],
    abstract:
      'Source code of the URSlab website, including the interactive browser model of a clothoid coordinated turn between two adjacent orthodromes, with comparison to a constant-radius arc and the curvature profile along the route.',
  },
  {
    year: 2026,
    title: "Application of Kummer's Equation for Flight Between Two Geodesic Orthodromes in a Coordinated Turn",
    authors: ['A. Madzharov'],
    venue: 'AMiTaNS 2026 — IOP Publishing, Journal of Physics: Conference Series',
    url: 'http://2026.eac4amitans.eu/',
    status: 'submitted',
    tags: ['navigation', 'geodesy', 'avionics'],
    funding: NSPDS,
    abstract:
      'A coordinated turn between two adjacent orthodromes is described by a clothoid on the WGS 84 ellipsoid. The heading equations reduce to a special case of Kummer\'s confluent hypergeometric equation, giving a closed-form heading law that lets the FMS compute turn duration and roll rate in advance.',
  },
  {
    year: 2026,
    title: 'Precise Calculations of Gravity Anomalies from the Geometric Height for Autonomous Air Navigation',
    authors: ['A. Madzharov'],
    venue: 'AMiTaNS 2026 — IOP Publishing, Journal of Physics: Conference Series',
    url: 'http://2026.eac4amitans.eu/',
    status: 'submitted',
    tags: ['gravity', 'navigation'],
    funding: NSPDS,
    abstract:
      'An analytical gravity model on WGS84 constants with an exact geometric relation for the vertical line. It matches WGS84/Somigliana within ±1.5 mGal at sea level and removes a latitude-dependent bias of up to 260 mGal at altitudes up to 10 km.',
  },
  {
    year: 2026, // излиза на 17.10.2026 (изменен договор със Springer)
    title: 'A Highly Accurate Calculation of the Difference Between Geocentric and Geodetic Latitude in Flight',
    authors: ['A. Madzharov', 'S. Hristozov'],
    venue: 'EnviroRISKs 2026 (N. Dobrinkova, S. Fidanova, Eds.) — Springer, Lecture Notes in Networks and Systems 2240',
    doi: '10.1007/978-3-032-39070-7_6',
    doiOff: true, // DOI-то се активира с излизането на електронната книга (Springer: 17.10.2026)
    url: 'https://link.springer.com/book/9783032390707',
    status: 'in-press',
    tags: ['geodesy', 'navigation'],
    funding: NSPDS,
    abstract:
      'Geocentric distance from the prime-vertical radius with a coefficient proportional to e⁴, including flight altitude — yielding high-accuracy analytical geocentric–geodetic latitude differences and a differential equation of the meridian ellipse for geodesic-line computation.',
  },
  {
    year: 2026, // излиза на 17.10.2026 (изменен договор със Springer)
    title: 'A Model of Gravity on the Surface of the Earth’s Ellipsoid Using an Accurate Analytical Relationship Between Geocentric and Geodetic Latitudes',
    authors: ['A. Madzharov', 'S. Hristozov', 'I. Gaidarski'],
    venue: 'EnviroRISKs 2026 (N. Dobrinkova, S. Fidanova, Eds.) — Springer, Lecture Notes in Networks and Systems 2240',
    doi: '10.1007/978-3-032-39070-7_4',
    doiOff: true, // DOI-то се активира с излизането на електронната книга (Springer: 17.10.2026)
    url: 'https://link.springer.com/book/9783032390707',
    status: 'in-press',
    tags: ['gravity', 'geodesy'],
    funding: NSPDS,
    abstract:
      'Implementation of standardised geophysical models in autonomous air-navigation algorithms: geodetic projections of a central gravitational field from WGS84 data, applying Clairaut\'s method with the exact geocentric–geodetic vertical difference.',
  },
];

export const tagLabels: Record<string, { bg: string; en: string }> = {
  navigation: { bg: 'Навигация', en: 'Navigation' },
  geodesy: { bg: 'Геодезия', en: 'Geodesy' },
  gravity: { bg: 'Гравитация', en: 'Gravity' },
  ins: { bg: 'INS/GNSS', en: 'INS/GNSS' },
  avionics: { bg: 'Авионика', en: 'Avionics' },
  security: { bg: 'Сигурност', en: 'Security' },
  software: { bg: 'Софтуер', en: 'Software' },
};
