// Публикации / Publications
// Нова публикация: добавете запис най-отгоре. authors — както са в статията (латиница).
// status: 'published' | 'in-press' | 'submitted'
// Ключовите думи (tags) се използват за филтрите на страницата.

export interface Publication {
  year: number;
  title: string;
  authors: string[];
  venue: string;
  status: 'published' | 'in-press' | 'submitted';
  doi?: string;
  url?: string;
  abstract?: string;
  tags: string[];
  funding?: string;
}

const NSPDS = 'NSP DS, MES grant D01-74/19.05.2022';

export const publications: Publication[] = [
  {
    year: 2026,
    title: 'URSlab Website and Interactive Coordinated-Turn Model: Source Code (v1.0.0)',
    authors: ['A. Madzharov'],
    venue: 'Zenodo — Software (files with restricted access)',
    status: 'published',
    doi: '10.5281/zenodo.23086274',
    tags: ['software', 'navigation'],
    abstract:
      'Source code of the URSlab website, including the interactive browser model of a clothoid coordinated turn between two adjacent orthodromes, with comparison to a constant-radius arc and the curvature profile along the route.',
  },
  {
    year: 2026,
    title: "Application of Kummer's Equation for Flight Between Two Geodesic Orthodromes in a Coordinated Turn",
    authors: ['A. Madzharov'],
    venue: 'AMiTaNS 2026 — AIP Conference Proceedings',
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
    venue: 'AMiTaNS 2026 — AIP Conference Proceedings',
    status: 'submitted',
    tags: ['gravity', 'navigation'],
    funding: NSPDS,
    abstract:
      'An analytical gravity model on WGS84 constants with an exact geometric relation for the vertical line. It matches WGS84/Somigliana within ±1.5 mGal at sea level and removes a latitude-dependent bias of up to 260 mGal at altitudes up to 10 km.',
  },
  {
    year: 2026,
    title: 'A highly accurate calculation of the difference between geocentric and geodetic latitude in flight',
    authors: ['A. Madzharov', 'S. Hristozov'],
    venue: 'EnviroRisks 2026',
    status: 'submitted',
    tags: ['geodesy', 'navigation'],
    funding: NSPDS,
    abstract:
      'Geocentric distance from the prime-vertical radius with a coefficient proportional to e⁴, including flight altitude — yielding high-accuracy analytical geocentric–geodetic latitude differences and a differential equation of the meridian ellipse for geodesic-line computation.',
  },
  {
    year: 2026,
    title: "A model of gravity on the surface of the Earth's ellipsoid using an accurate analytical relationship between geocentric and geodetic latitudes",
    authors: ['A. Madzharov', 'S. Hristozov', 'I. Gaidarski'],
    venue: 'EnviroRisks 2026',
    status: 'submitted',
    tags: ['gravity', 'geodesy'],
    funding: NSPDS,
    abstract:
      'Implementation of standardised geophysical models in autonomous air-navigation algorithms: geodetic projections of a central gravitational field from WGS84 data, applying Clairaut\'s method with the exact geocentric–geodetic vertical difference.',
  },
  {
    year: 2026,
    title: 'Compensations for Horizontal Inertial Components of INS/GNSS with Flight Altitude',
    authors: ['A. Madzharov', 'S. Hristozov', 'I. Gaidarski'],
    venue: 'Engineering Proceedings (MDPI), vol. 150, no. 1, art. 70',
    status: 'published',
    tags: ['navigation', 'ins'],
    doi: '10.3390/engproc2026150070',
  },
  {
    year: 2026,
    title: 'Constructive Approach to the Design of Data Protection Systems: Models and Transformation',
    authors: ['I. Gaidarski', 'A. Madzharov'],
    venue: 'Engineering Proceedings (MDPI), vol. 150, no. 1, art. 53',
    status: 'published',
    tags: ['security'],
    doi: '10.3390/engproc2026150053',
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

// Архив: годишни страници на сайта (заменят PDF файловете от стария сайт) — виж archivePages.ts
import { archivePages } from './archivePages';
export const archives = archivePages.map((p) => ({ label: p.title, slug: p.slug }));
