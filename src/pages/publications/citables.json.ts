// /publications/citables.json — за всеки член на колектива: публикуваните му трудове (ключ, заглавие, година)
// и вече въведените им цитирания. Ползва се от формата в режим „Ново цитиране“ и от проверката в GitHub
// (scripts/add-citation.mjs), за да се намери цитираният труд и да не се въведе едно цитиране два пъти.
import { allPubs } from '../../data/allPubs';
import { citables } from '../../data/citations';
export const GET = () => new Response(JSON.stringify(citables(allPubs)), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
