// Точки за цитирания по Минималните национални изисквания (ППЗРАСРБ, Таблица 2, група „Д“)
// и Правилника на БАН — Област 5 „Технически науки“. При друга област сменете стойностите тук.
export type CitInd = '12' | '13' | '14';

export const citRules: Record<CitInd, { pts: number; label: { bg: string; en: string } }> = {
  '12': {
    pts: 10,
    label: {
      bg: 'Д-12 — цитиране в научни издания, реферирани и индексирани в Scopus или Web of Science',
      en: 'D-12 — citation in a scientific publication indexed in Scopus or Web of Science',
    },
  },
  '13': {
    pts: 3,
    label: {
      bg: 'Д-13 — цитиране в монографии и колективни томове с научно рецензиране',
      en: 'D-13 — citation in a peer-reviewed monograph or edited volume',
    },
  },
  '14': {
    pts: 2,
    label: {
      bg: 'Д-14 — цитиране в нереферирани списания с научно рецензиране',
      en: 'D-14 — citation in a non-indexed peer-reviewed journal',
    },
  },
};
export const citPts = (ind: CitInd) => citRules[ind].pts;
