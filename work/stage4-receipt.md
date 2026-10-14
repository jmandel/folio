# Stage 4 receipt: workbench v1

Branch `stage4` (worktree `.worktrees/stage4`). Nothing pushed. The workbench is a static site with no runtime server. It uses Vite, React and TypeScript and lives in `site/`.

## What exists

| Path | What it is |
|---|---|
| `site/scripts/prepare-data.ts` | Build step. Reads `build/signed/`, `corpus/`, `sources/`, `spec/`, `truth/` and `runs/`, and writes git-ignored files to `site/public/`. |
| `site/public/data/` | Generated. `index.json`, the signed items for 10 patients (hero, s01–s04, and pilot patients p016, p047, p076, p155, p217: 1,478 items in all), each source's README, schema and examples, 48 recorded prose runs, and the spec pages. |
| `site/public/hosts/<issuer host>/` | Generated. `.well-known/did.json` and `folio/schemas/<file>.d.ts` at their did:web and schema paths. The browser maps each issuer host to `hosts/<host>` through `createDidWebResolver({hostMap})`, so DIDs and schema URLs stay exactly as issued. |
| `site/src/` | The app. Hash routes (`#/record/hero/lakeview/<id>?traps=1`) and relative asset paths (`base: "./"`), so it works under `/folio/`. |
| `site/scripts/screens.ts` | Headless Chromium smoke test plus screenshots (`bun run site:check`). |
| `.github/workflows/pages.yml` | On push to main: `bun install`, then `bun run site:build`, then upload `site/dist` and deploy to Pages. Pages itself is not enabled. |

### Views

1. **Record**
   - Shows the merged timeline across the four sources, grouped by year, with filters for source, search, and "items with a note".
   - Each item renders as a document: source letterhead, dates (local America/Chicago; partial dates keep their precision), author, narrative and structured entries.
   - Linking between prose and data:
     - Clicking a highlighted span opens a popover with its entry.
     - Clicking an entry highlights its span(s).
     - Narrative-only spans are listed and explained.
     - Items without narrative show every entry expanded.
   - Every item is verified in the browser with `@folio/core`, and the content shown is the verified content. Progress appears as "466 of 466 signatures verified", plus a status on each item.
   - A "Signature and provenance" panel per item shows:
     - the issuer, `kid`, alg/typ, and the DID document URL and key;
     - the schema URL, with the fetched schema's SHA-256 compared to the declared hash;
     - unit counts, the signed claims and the raw SD-JWT;
     - a **"Change one character and check again"** button, which visibly fails.
   - The **History** switch shows superseded and retracted items. They are struck through and link both ways to the items that replaced them.
   - The **Planted traps** switch (off by default) tags items with trap ids from the render step. It adds a filter by trap and a panel per item quoting `truth/TRAPS.md`.
2. **Sharing**
   - Starts with five hero items preselected. "Withhold mental-health details" is on by default, and each disclosure unit has its own checkbox.
   - Presentations are made in the browser, then verified with a fresh resolver, as the recipient would.
   - Received items carry hatched "withheld" markers and a partial-item banner, and the count of withheld entries is shown.
   - A summary bar shows how many presentations verified, the parts withheld, the bytes sent, and the result of searching what is sent for "sertraline/depression": 0 hits.
   - A context-loss box quotes the sentences the receiver will actually read, including "Na 132, mild. Chlorthalidone likely; [withheld]. No change today.", and links to `signing.md#context-loss`.
3. **Sources**
   - Each source's README sits beside its schema and examples.
   - The schema has two views: "Docstrings as prose" (each docstring rendered as Markdown above its highlighted declaration) and "Source file".
   - Each example can be shown rendered or as `.folio.md` text.
   - Repo links inside READMEs and spec pages are rewritten to routes on the site.
4. **Compiler**
   - Lists the 48 recorded prose runs, grouped by patient.
   - Each run has a replay with four parts: the prompt (collapsible), a step-by-step transcript (Replay, Pause, Show all), and each note written with its validator outcome, linked to its signed item in the Record view.
   - The fourth part is a placeholder for "Mapper code and scores", to be filled from Stage 3 outputs.
   - `hero-homelog-a2` shows a retry that was driven by validator feedback.
5. **About**
   - A short plain explanation of the idea, followed by the four spec pages, HERO.md and TRAPS.md, rendered with a table of contents and anchors.

Design: chart-paper surfaces with slate ink. One highlighter yellow ties spans to entries, each source gets a muted hue as a margin tab, and withheld parts are hatched. Fonts are Source Serif 4 for notes and documents, Public Sans for the interface and Source Code Pro for code. The theme follows the system, with a manual light/dark override. Layouts are checked at 1280×720 and 390×844.

## How to run and build

```
bun install
bun run sign            # build/signed (needed by the site build)
bun run site:dev        # prepares data, then Vite dev server
bun run site:build      # sign + prepare data + vite build → site/dist (relative base)
bun run site:check      # serves site/dist under /folio/, smoke test + screenshots → work/stage4-screens
bun site/scripts/screens.ts --no-screens   # smoke test only
```

`site:check` uses `$CHROMIUM` if set, then Playwright's cache, then `/usr/bin/chromium` (`playwright-core`; the browser is not downloaded).

## Verification

- **Smoke test** (`site/scripts/screens.ts`, against `site/dist` served under `/folio/`):
  - All 1,478 shown items verify in Chromium (WebCrypto Ed25519), with 0 failures, for each of the 10 patients.
  - A one-character tamper fails: "SD-JWT verification failed: Unreferenced disclosure(s)".
  - Sharing: 5 of 5 presentations verify as the recipient would, 5 of 67 parts are withheld, and "sertraline" and "depression" appear nowhere in what is sent.
- `bun run typecheck` now also checks `site/`, which is clean. The 8 tsc errors it reports are in `packages/truth` (`keys.ts`, `population.ts`) and were already there before this stage. `bun test` passes 242 tests.
- `bun install --frozen-lockfile` is clean. `site/dist` keeps `hosts/*/.well-known/` and `.nojekyll`. The workflow uses `upload-pages-artifact@v3` because v4 drops dotfiles.

## Screenshots (`work/stage4-screens/`)

There are six views:

| File prefix | What it shows |
|---|---|
| `record` | Nephrology visit with the `dx_na` popover open |
| `record-traps` | T3 filter with history on, showing the superseded 2022 potassium |
| `sharing` | The sharing view |
| `sources` | Lakeview schema, docstrings as prose |
| `compiler` | The hero HomeLog retry run |
| `about` | Signing spec at context loss |

Each view was captured at `1280x720` in light and dark and at `390x844` in light. Those 18 files are committed. The `390x844` dark files are generated too, but git-ignored.

## Known gaps

- **No compiled mappers yet.** The Record view merges sources by date only. It does no cross-source de-duplication and builds no app views. The Compiler view's mapper and score section is a placeholder until Stage 3 lands.
- **Display heuristics.** Item titles and one-line entry summaries are generic display code (`site/src/lib/describe.ts`), not mappers. Some are plain, such as "Day page: 1 BP reading…".
- **Coarse trap tags.** Tags are per item and come from the render step's `traps` field. T10 (dates/time zones) is on 379 of 466 hero items, which makes the unfiltered trap mode noisy; the per-trap filter is the useful mode.
- **Sharing is hero-only.** The preset matches sensitive units by text and the `restricted` flag. Its five default items are fixed, and more can be added.
- **No live agent mode.** The Compiler view only replays recorded runs.
- **Bundle size.** The JS bundle is 526 kB (183 kB gzip). It is not split per view, and `yaml` comes in through `@folio/core`'s Markdown parser.
- **Fonts.** Fonts load from Google Fonts. Offline, for example at a talk without network, the fallbacks are Georgia and system-ui.
- **Workflow assumptions.** The workflow assumes that `corpus/`, `runs/` and `sources/*/keys` stay committed, and it uses `bun-version: latest`.
- **Shared files with Stage 3.** Root `package.json` (workspaces add `site`, four `site:*` scripts, and a `typecheck` that now also covers the site) and root `tsconfig.json` (`exclude`) may conflict trivially with the parallel Stage 3 branch.
