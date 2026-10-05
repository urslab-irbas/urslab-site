// /publications/all.json — всички публикации на сайта (заглавие, автори, DOI, година, страница).
// Ползва се от формата „Нова публикация“ и от проверката в GitHub, за да не се въвежда една публикация два пъти.
import { dupList } from '../../data/allPubs';
export const GET = () => new Response(JSON.stringify(dupList), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
