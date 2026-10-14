# Story receipt: front page

Branch `story`. Nothing was pushed. Only `site/` and the `work/story-*` files changed.

## What changed

- **`#/` is now a front page** (`site/src/views/Home.tsx`). Unknown routes fall back to it.
- **Top bar.** It shows "Overview", then a named group, "Explore the data", which holds Record, Sharing, Sources, Compiler and About. All the old routes still work. The wordmark links to `#/`.
- **Order of the front page:**
  1. A lede and "The problem", side by side on a laptop.
  2. "The idea". The diagram is plain HTML/CSS and stacks on a phone. It has three stages: publish, once per schema version, every read.
     - The sample item is Northgate's real `med_1` stop event, and its schema hash `6acf8173…` is shown.
     - The same hash appears again as the cache key, which ties the stages together.
  3. "One fact in four records". There is one column per source.
     - The page loads `data/patients/hero.json`, verifies only the 6 quoted items in the browser, and quotes the verified spans and fields.
     - Then comes "The same facts in a reader's views". Each part cites (source, item id, ref id), and each citation shows a verified seal only if the item verifies and the ref exists in it.
  4. "A short tour of the workbench", in 5 steps.
  5. "What this is and isn't".
- **Lakeview has no allergy or status row for empagliflozin.** Its schema has no allergy type. What it actually has is shown instead:
  - the `dx_dka_hx` row (Z86.39, `DX_STATUS` H);
  - the narrative-only span `sglt2_decision`.
- **Length.** The page is 2,772 px tall at 1280 wide, about 3.8 laptop screens. That is over the 2–3 target. The trace grid is the main cost.

## Deep links (new)

| Link | Effect |
|---|---|
| `#/record/<pid>/<source>/<item>?ref=<id>` | Selects that span: the highlight, the entry popover, and the entry opened. An entry with no words is highlighted and scrolled into view. |
| `…&traps=1&trap=T1` | Opens that trap's panel. |
| `#/sharing?s=context-loss` | Scrolls to the context-loss note (`#context-loss`). |
| `#/sharing?preset=off` | Starts with nothing withheld. |
| `#/sources/<dir>?tab=schema`, `#/compiler`, `#/about/<page>` | Already existed. |

## Slot for compiled-mapper output

`site/src/views/Home.tsx` imports `site/src/story/dka-merged.json` through `site/src/story/dka.ts`, which also holds the TypeScript types. To swap in Stage 3 output, replace that file with one of the same shape:

```ts
{
  kind: "answer-key" | "compiled-mapper",  // the label switches to "Compiled mapper output" and shows `basis`
  patient: "hero",
  basis: string,                            // one sentence: mapper id(s) + schema sha256(s)
  rows: {
    view: string,                           // "Medications", "Allergies and intolerances", or a FHIR type
    title: string,                          // the one line the view shows
    parts: { label: string, text: string,
             cites: { source: "riverside"|"northgate"|"lakeview"|"homelog", item: string /* envelope id */, ref: string }[] }[]
  }[]
}
```

- Any cited item is loaded and verified automatically.
- Today the file holds the answer key, written by hand from `m_empagliflozin` and `a_empagliflozin` in `packages/truth/src/hero.ts` and from `corpus/answers/hero/allergies.json`.
- The page labels it "Expected result (answer key)".

## Verification

- `bun run site:build` passes.
- `bun run site:check` passes with 0 failures.
  - All 1,478 items verify, the tamper check still fails as it should, and sharing still verifies.
  - New: the front page shows 6 verified excerpts and 7 verified citations.
  - New: each of the 13 front-page links into the workbench is visited and checked:
    - Record links: the highlighted ref is present, and so is the open trap panel.
    - The Sharing link: the context-loss note is in view.
    - The Sources, Compiler and About links: the target page is shown.
- `site:check` also rewrites `work/stage4-screens`. I restored those files with `git checkout`.
- `tsc -p site` is clean.
- Screenshots are in `work/story-screens/`:
  - `home`, `deeplink` (a T1 deep link with its popover) and `sharing`, each at 1280×720 and 390×844, light and dark;
  - full-page `home-*-light-full.png` at both sizes.
  - Command: `bun site/scripts/screens.ts --out work/story-screens --only home,deeplink,sharing --full`.

## Notes

- Step 5 says 300 synthetic patients, from `corpus/MANIFEST.json`.
- The Riverside excerpt's date is the discharge summary's `effective` date, which is the admission (Nov 2, 2024).
