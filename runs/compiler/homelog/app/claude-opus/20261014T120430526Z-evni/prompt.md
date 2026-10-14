# Write a mapper

You are writing a deterministic mapper from one source system's FOLIO record items into the consumer's app views in `in/views/views.d.ts`.

## What you have (all under `in/`)

- `in/schema/homelog-v1.d.ts`: the source system's schema. This is the only documentation of the source.
  Its docstrings say what every field and code means; read all of it.
- `in/views/`: the target view definitions, written by the consumer. Their docstrings are the
  specification of the output: which rows to emit, which to leave out, units, statuses, time rules.
- `in/samples/`: 8 sample items from 3 patients of this source, in FOLIO Markdown form
  (frontmatter = envelope, then narrative, then the `json payload` block). `in/samples/samples.json` has
  the same items in JSON form, grouped by patient: that is the form your function receives.
- `in/harness/`: `sh in/harness/check.sh [asOf]` type-checks your mapper (strict, no Node/Bun types) and runs
  it on the sample patients, printing the rows.

## The task

Write `out/transform.ts` exporting

```ts
export function transform(items: FolioItem[], asOf: string): ViewRows
```

(the type `Transform` in `in/views/views.d.ts`). It receives every item this source
published for ONE patient, in no particular order, including items that were later superseded or
retracted, and a local date `asOf` (`YYYY-MM-DD`). It returns the rows describing this source's record
as of the end of that day.

Your mapper will be run, unchanged, on many other patients of this source whose records contain
situations the samples do not show. Rely on the schema's documentation for those, not only on the
samples. Nobody will review the output by hand; a mapper that runs cleanly but reads a field wrongly
produces wrong clinical data.

## Rules

- `out/transform.ts` is self-contained TypeScript. Its only allowed import is
  `import type { … } from "../in/views/views"` (and `"../in/views/views"`). No other imports.
- Deterministic: no clock (`Date.now()`, `new Date()` without an argument), no randomness, no network, no
  file system, no environment. Parsing dates with `Date.parse`/`new Date(string)` and `Intl` time-zone
  formatting are fine.
- It must type-check (`sh in/harness/check.sh`) and must not throw on input it does not expect: skip
  what it cannot read.
- You may write and run your own tests or scratch scripts under `out/` with `bun`. Only
  `out/transform.ts` is used.

When you are done, reply with a few lines on the judgment calls you made.

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
