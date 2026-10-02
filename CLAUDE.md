# URSlab website — notes for Claude Code

Bilingual static site (Astro) for the Unmanned Robotic Systems Laboratory, Institute of Robotics, BAS.
Target domain: https://urs.ir.bas.bg

## Structure
- Bulgarian is the default language at `/`, English at `/en/`. Every page exists in both; the menu switch links to the same slug in the other language (`src/lib/i18n.ts`).
- Content lives in `src/data/` — edit data, not markup:
  - `team/<id>.ts` — one file per staff member (BG/EN names and titles, ORCID, links, interests); order in `team/index.ts`
  - `publications.ts` — publications, newest first; tags drive the filters
  - `archive2022.ts`, `archive2025.ts`, `archive2026.ts`, `archiveEarlier.ts` — yearly publication pages (/publications/2022-2024/, /2025/, /2026/, /earlier/); each entry goes on the page of its publication year; shared types, categories and topic tags are in archive2022.ts; the list of pages (order in „Архив“) is `archivePages.ts`. 2025/2026 come from the BAS report „XX а: Всички публикации – публикувани“ (share = % authors from IR)
  - `allPubs.ts` — all publications on the site (archive pages + publications.ts, de-duplicated by DOI/title) → per-member „Обобщен отчет“ at /team/<id>/report/ (button on each Team card)
  - `content.ts` — menu, intro text, research areas, projects, services, contacts, UI strings
- Page views: `src/views/` (Home, Team, Publications, Simple = research/projects/services/contact). Route files in `src/pages/` and `src/pages/en/` are thin wrappers.
- Interactive clothoid coordinated-turn demo: `src/components/ClothoidDemo.astro`.
- Images: `public/images/team/`, `public/images/gallery/` (gallery auto-lists files).

## Rules
- Always update BOTH languages when adding or changing text.
- Academic titles: BG "доц. д-р инж.", "доц. д.н. инж.", "гл. ас. д-р инж."; EN "Assoc. Prof. Dr. Eng.", "Assoc. Prof. DSc Eng.", "Chief Assist. Prof. Dr. Eng.".
- Do not publish full texts of papers under review; title, authors, venue, abstract only.
- Run `npm run build` after changes and fix any errors before committing.

## Commands
- `npm install` · `npm run dev` (http://localhost:4321) · `npm run build` (output in `dist/`)

## Workflow
- Changes reach `main` only via Pull Request approved by the lab head. CODEOWNERS maps each profile file to its owner.
- Every PR runs `.github/workflows/build.yml` (npm ci + build); the built `dist/` is attached as an artifact `urslab-dist`.
- Colleague instructions (Bulgarian): `CONTRIBUTING.md`.
- `.github/workflows/deploy.yml` uploads `dist/` to the server (lftp mirror, no deletions) on every push to `main`, using `DEPLOY_*` repository secrets. Merge = live.
- Visitor statistics: GoatCounter script (`is:inline`) in `src/layouts/Layout.astro`, dashboard https://urslab.goatcounter.com.
- Research areas ↔ publications: each area in `content.ts` has `tags`; area cards (`AreaCard.astro`) link to `/publications/?area=<key>`, which pre-selects that area's filter. Areas with no matching publications show "forthcoming".
