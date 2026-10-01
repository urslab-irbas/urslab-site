# URSlab website — notes for Claude Code

Bilingual static site (Astro) for the Unmanned Robotic Systems Laboratory, Institute of Robotics, BAS.
Target domain: https://urs.ir.bas.bg

## Structure
- Bulgarian is the default language at `/`, English at `/en/`. Every page exists in both; the menu switch links to the same slug in the other language (`src/lib/i18n.ts`).
- Content lives in `src/data/` — edit data, not markup:
  - `team.ts` — staff (BG/EN names and titles, ORCID, links, interests)
  - `publications.ts` — publications, newest first; tags drive the filters
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
