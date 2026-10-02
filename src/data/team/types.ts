// Общ формат на профил / Shared profile format
export interface Member {
  id: string;
  name: { bg: string; en: string };
  title: { bg: string; en: string };
  role?: { bg: string; en: string };
  orcid?: string;
  github?: string;   // GitHub акаунт → бутон „Нова публикация“ в „Състав“ и право да въвежда публикации
  email?: string;
  scholar?: string;
  researchgate?: string;
  dissertation?: string;
  thesis?: { bg: string; en: string };
  photo?: string;
  interests?: { bg: string[]; en: string[] };
}

