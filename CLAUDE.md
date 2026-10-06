# URSlab website — notes for Claude Code

Bilingual static site (Astro) for the Unmanned Robotic Systems Laboratory, Institute of Robotics, BAS.
Target domain: https://urs.ir.bas.bg

## Structure
- Bulgarian is the default language at `/`, English at `/en/`. Every page exists in both; the menu switch links to the same slug in the other language (`src/lib/i18n.ts`).
- Content lives in `src/data/` — edit data, not markup:
  - `team/<id>.ts` — one file per staff member (BG/EN names and titles, ORCID, links, interests); order in `team/index.ts`
  - `publications.ts` — CURRENT list (submitted / in press) shown on „Публикации“; items with status 'published' move automatically to the yearly archive page by year (archivePages.ts). Filters on „Публикации“ search all site publications (`allPubs.ts`: currentList + archiveList)
  - `archive2022.ts`, `archive2025.ts`, `archive2026.ts`, `archiveEarlier.ts` — yearly publication pages (/publications/2022-2024/, /2025/, /2026/, /earlier/); each entry goes on the page of its publication year; shared types, categories and topic tags are in archive2022.ts; the list of pages (order in „Архив“) is `archivePages.ts`. 2025/2026 come from the BAS report „XX а: Всички публикации – публикувани“ (share = % authors from IR)
  - `allPubs.ts` — all publications on the site (archive pages + publications.ts, de-duplicated by DOI/title) → per-member „Обобщен отчет“ at /team/<id>/report/ (button on each Team card)
  - `contrib.json` — (authoritative copy lives in branch `data`; main has `[]`) publications entered via the site form /publications/new/ (GitHub issue → `.github/workflows/publication.yml` + `scripts/add-publication.mjs` validate with `src/lib/pubSchema.js`, append here, open a PR); distributed to yearly pages by `archivePages.ts` (a page for a new year is created automatically). Team members with `github` in their profile get the „+ Нова публикация“ button. Form rules: `status` (published / in-press / submitted) — unpublished ⇒ `cat: 'sub'`, no metrics; no DOI ⇒ `idType` (issn/eissn/isbn/eisbn) + checksum-valid number (stored as `issn`/`isbn` + `idType`). The Action verifies identifiers in public registers (`scripts/verify-ids.mjs`: doi.org + Crossref/DataCite title match; ISSN → NACID NRS API `nrs.nacid.bg/api/Public/Nrs/GetInactiveAndActive?intNumber=` → ISSN Portal; ISBN → NRS → Crossref → Open Library), refuses if not found/unreachable, sets `nrsId` from NRS, then publishes WITHOUT manual approval: commits `src/data/contrib.json` + `publish-log.md` to the unprotected orphan branch `data` (a personal-account repo cannot put GitHub Actions in the main ruleset bypass list), dispatches `deploy.yml`; deploy/build/publication workflows overlay `src/data/contrib.json` from `data` onto `main` (the copy in `main` is `[]`). Logs to `publish-log.md` (branch `data`), mentions the owner; ticking „Върни“ in the bot comment (owner only) runs `revert-publication.yml`. Scimago/Google Books are not used (bot-blocked / quota). The form locks after „Запиши“ and polls the public GitHub issues API for the request's labels (публикувана/отказана); it pre-checks for an already-published issue with the same title. Rejections @mention the author with per-error fix steps (HOW map in add-publication.mjs). Branch `data` has its own `.github/workflows/redeploy.yml` (push → dispatch deploy.yml) because push workflows run from the pushed branch's tree.
  - Research-area cards (`AreaCard.astro`): „Автономна навигация“ keeps its own page and the count from `publications.ts`; all other areas count ALL site publications (`allPubs`, incl. form entries) and link to /publications/area/<key>/ — counts update automatically on every build.
  - `nspsdRefs.ts` + `nspsd.ts` — publications under the National Scientific Program “Security and Defence” (grant D01-74/19.05.2022) → page /projects/nspsd/ (button „Публикации“ on the project card; view `Archive.astro` with `program="nspsd"`). `nspsdRefs` lists title fragments (+ task numbers); entries already on the site are taken from `allPubs` (site spelling is authoritative), others are full records in `nspsdExtra`. Every listed publication gets `fund` = „NSP DS, MES grant D01-74/19.05.2022“; the same text is shown as „Финансиране“ in the „Публикации“ list. The build fails if a reference matches nothing.
  - `/docs/NNPSO_Publications_IR-BAS.xlsx` — the NSP DS publications in the programme's Excel template, GENERATED on every build by `src/pages/docs/NNPSO_Publications_IR-BAS.xlsx.ts` (exceljs) from `nspsdPubs` — so it always matches /projects/nspsd/. Template: `scripts/nspsd/template.xlsx`; extra per-row data (type, full venue name, volume/pages, link, ISSN/ISBN, language, note) in `src/data/nspsdExcel.ts` (keyed like nspsdRefs; optional — new entries are filled from the site record); publisher data by DOI (full author names, date, volume/issue/pages, abstract) in `src/data/nspsdMeta.json` (Crossref snapshot). Button „Експорт към ННП „СО“ (Excel)“ on /projects/nspsd/, next to a link to https://nsp.secade.bg/bg/rezultati/publikacii.
  - `nspsdActivities.ts` — NSP DS „Докторанти по ННП СиО“ (/projects/nspsd/phd/) and „Конференции и семинари“ (/projects/nspsd/events/: 1. participations, 2. organised events), view `src/views/NspActivity.astro`; buttons next to „Публикации“ on the project card (`projects[].more` in content.ts). Papers are title fragments resolved against the site's publications (build fails if not found).
  - `series.ts` — expected indexing (latest SCImago SJR + quartile, SJR_YEAR) of the series/journals where submitted / in-press papers will appear; matched on `venue`, shown as „Очаквано: Q4 · SJR 0.165 (2025)“ / „Expected: …“ on items with cat 'sub' (Archive.astro) and unpublished items (PubList.astro). Papers stay in „Подадени / под печат“; update the numbers when SCImago publishes a new year.
  - `content.ts` — menu, intro text, research areas, projects, services, contacts, UI strings
- Page views: `src/views/` (Home, Team, Publications, Simple = research/projects/services/contact). Route files in `src/pages/` and `src/pages/en/` are thin wrappers.
- Interactive clothoid coordinated-turn demo: `src/components/ClothoidDemo.astro`.
- Images: `public/images/team/`, `public/images/gallery/` (gallery auto-lists files).
- Image protection: no right-click / drag / long-press save on images (script + CSS in `Layout.astro`, `global.css`); galleries open the large photo in the in-page lightbox (`<button data-lb="/images/…" data-cap="…">`, shown as a CSS background) — never link directly to image files; `public/.htaccess` answers 403 for `/images/…` without a Referer from urs.ir.bas.bg (direct opening, hotlinking) and sends `X-Robots-Tag: noimageindex`. Strip EXIF/GPS from every uploaded photo.

- Training deck for new team members: `public/docs/URSlab-rakovodstvo.pptx` + `.pdf` (button „Помощ за нов член на екипа“ on the Team page). Generator: `scripts/help-deck/build.js` (pptxgenjs; screenshots of the site) — rebuild the deck when site features change.

- NACID National Reference List (НРС): `src/data/nrs.ts` — publications in listed venues automatically get the NRS note, the venue's ISSN and category 'nat' (if they were 'other').

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
