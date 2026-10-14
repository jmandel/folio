# @folio/render

Renders the truth into each source's record items, writes narrative through the agent runner, and
builds the corpus.

| File | What it does |
|---|---|
| `src/riverside.ts` | A: one item per signed hospital document; per-document home-med and diagnosis statuses; UTC payload times |
| `src/northgate.ts` | B: event items (visit note + billing dx, vital set, med/problem/allergy event, list review, imported result per accession, referral step, void); outside lines that lag |
| `src/lakeview.ts` | C: requisition items (corrections supersede), clinic contacts (status-history rows); Northgate's imports are derived from these rows |
| `src/homelog.ts` | P: day pages (wall-clock times, meter units as shown, superseding edits) and My Medicines saves |
| `src/hero-hints.ts` | Which hero items are the Stage 0 examples, and the native ids those examples use |
| `src/context.ts` | Rendering context, native-id allocation, `NoteRequest` and `RenderedItem` types |
| `src/guards.ts` | What a note must not say (meds not yet started, facts another source holds) and sensitive words that must stay inside their spans |
| `src/validate.ts` | Deterministic narrative checks |
| `src/prose.ts` | Batches, prompt, agent call, retry with feedback, ledger |
| `src/corpus.ts` | Build, resolve narratives, write `corpus/` |
| `src/cli/{gen,prose,check}.ts` | `bun run gen`, `bun run prose`, `bun run check:corpus` |

## Narrative

Each item that needs prose gets a **note request**: the payload entries to wrap in `<ref>` spans
(each exactly once), narrative-only spans with the statement they must carry, prose-only facts and
negations that must be stated (regex evidence), context the author may use, forbidden mentions, and
sensitive words that may appear only inside named spans. The prose step sends every request of one
(patient, source) to one agent call with the source's style guide and reference notes from its
examples; the agent writes `out/notes.md`. Each note is validated; failures go back with the
problems listed, up to `--retries` more calls. Accepted notes are recorded in
`corpus/prose-ledger.json` (item key, request hash, run), and `bun run gen` replays them from `runs/`
without calling an agent. A request whose hash changed (the truth or renderer changed) is written
again. Items without accepted prose carry a deterministic template placeholder, counted as
`template` in `corpus/MANIFEST.json`.

Items that reproduce a Stage 0 example use the example's narrative; `test/golden.test.ts` checks that
the hero's rendering reproduces all 31 examples exactly (payload, envelope, ids, narrative).

## Commands

```
bun run gen                     # truth + render (+ ledger prose) -> corpus/, no agent calls
bun run prose --patients hero,s01 [--backend claude|codex] [--model sonnet] [--concurrency 6] [--retries 2] [--tmux] [--dry-run]
bun run check:corpus            # parse, envelope, hashes, tsc on every payload, refs, prose re-validation, trap coverage
```

`runs/prose/summary.jsonl` has one line per batch: notes requested and accepted, attempts, cost,
agent and wall time.
