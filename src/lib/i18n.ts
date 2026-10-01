import type { Lang } from '../data/content';

// Български е по подразбиране на "/", английският е на "/en/".
export function href(lang: Lang, slug: string): string {
  const base = lang === 'bg' ? '/' : '/en/';
  return slug ? `${base}${slug}/` : base;
}
