# Stage 0b brief — one source system

You are designing ONE synthetic source system for the FOLIO reference stack (repo ~/hobby/folio). Read first, in this order:
1. `PLAN.md` sections 1–3 (goal; readability is the top priority).
2. `spec/record-item.md` and `spec/schema-conventions.md` (normative; follow them exactly).
3. `truth/HERO.md`, `truth/TRAPS.md` (the parts relevant to your source), skim `truth/MODEL.md`.
4. `work/decisions.md` (overrides anything above it conflicts with; T8 is dropped).

Deliverables, all under `sources/<your-dir>/`:
- `README.md` — one screen: who this system is, its modeling style in 3–5 bullets, list of entry types, which traps live here and how (by trap number).
- `schema/<name>-v1.d.ts` — the schema (more than one file only if the style genuinely needs it, e.g. a published code table). 10–20 entry types max; aim lower. Honest docstrings per the conventions. Values typed the way this source stores them (if it stores numbers as text, say so).
- `examples/` — 4–6 record items from the hero patient, in the Markdown form, named `<yyyy-mm-dd>-<slug>.folio.md`. Pick the ones that best show the style and its traps. Leave `sha256` as `TODO` and omit signatures. Use realistic but obviously synthetic identifiers.
- `NOTES.md` — anything you had to decide that the spec/story didn't settle, and any spec problems you hit (be specific; these feed spec revisions).

Rules:
- Readability first: a newcomer should understand the schema and one example in ten minutes. Realism comes from the planted traps and honest documentation, not from volume.
- Stay within your directory. Don't edit spec/ or truth/; report problems in NOTES.md.
- Match the hero facts in truth/HERO.md exactly (dates, values, units). If HERO.md is inconsistent or missing something you need, decide minimally and log it in NOTES.md.
- Don't commit. Return a ≤120-word receipt: files written, traps covered, top spec/story issues.
