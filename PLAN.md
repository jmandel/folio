# FOLIO reference stack — plan

Status: draft 1, 2026-10-13. Background drafts: `background/folio-v1-draft.md`, `background/folio-v2-draft.md`.

## 1. What we are trying to show

One idea, made concrete and inspectable:

> Systems publish their **native** clinical data as signed, append-only **record items** that bind
> readable narrative to structured payloads, described by plain **TypeScript schemas with real
> docstrings**. Consumers use AI **once per schema version** to write deterministic mappers into the
> views they need (their own small views, or FHIR), check those mappers against independent evidence,
> and cache them by schema hash. Runtime reads are ordinary code.

Everything else (sync, signing, selective disclosure, population search, agent-to-agent workflows, the
documentation benchmark) is supporting cast that shows the idea composes into a working ecosystem.

The reference stack must be **small enough to read**. A newcomer should be able to open one source
system's schema and one patient's log and understand them in ten minutes. Real-world complexity is
*gestured at* through deliberately planted traps, not reproduced through volume.

Framing: keep the name FOLIO; describe it as late binding with compiled mappers. No "Software 3.0",
"post-FHIR", invented performance numbers, or "mathematically impossible" claims. Every number we
show comes from a run in this repo.

## 2. Decisions already made

| Topic | Decision |
|---|---|
| Audiences | Public site (joshuamandel.com/folio), live talk walkthrough, developers cloning the repo, written essay. |
| v1 includes | Record format + sync + signing/disclosure; compiler agent + checking; population funnel; agent-to-agent flow + documentation benchmark. Staged, not all at once. |
| Sources | Three synthetic EHRs with deliberately different modeling styles + the patient's own app. |
| Clinical domain | Cardiometabolic (diabetes, CKD, hypertension) hero patient, plus one sharper subplot that drives an intake/trial scenario. |
| Mapper targets | Small app-defined views (meds, problems, labs, vitals, allergies) as primary; US Core FHIR as a second consumer ("FHIR is one view, not the wire format"). |
| Epic EHI export | Late contrast node: a curated slice of the real redacted export (`vendor/my-ehi`) projected into FOLIO in a late stage. Also a source of realistic quirks to plant in the clean sources. |
| LLM runtime | Live when available, every run recorded (transcript + artifacts) and replayable offline; the public site replays. |
| Agent execution | Runtime agents are **CLI agents**: `claude -p` or `codex exec`, non-interactive or inside tmux for watching. One runner interface, pluggable backend. |
| Spec | Small normative spec in `spec/`, kept in step with code, published on the site. |
| Repo | Public `jmandel/folio`; commit and push at stage boundaries; deploy site when a stage passes. |
| Check-ins | Gate at the end of each stage: short report, link/screenshot, open decisions. |
| Schema size (Gate 0) | 230–560 lines of mostly docstrings is fine; honest documentation is the point. |
| Population prose (Gate 0) | LLM-written for all notes, via the CLI agent runner, recorded. The agent runner therefore moves from Stage 3 into Stage 1. |

## 3. Design constraints carried from the review of the drafts

These are the problems in v1/v2 that the build must answer rather than assert:

1. **Ground truth is separate from renderings.** The synthetic generator first produces a source-neutral
   *clinical truth* per patient; each EHR's records and prose are renderings of that truth. Answer keys
   come from the truth, never from a rendering, so checking is not circular.
2. **Structured-only data is first-class.** Most real data (labs, vitals, med administrations) has no
   paired prose. Mapper checking must not depend on prose alone; report results separately for items
   with and without narrative.
3. **Who authored the `<ref>` spans is explicit.** In the clean sources the issuing EHR authors them. For
   the Epic contrast node they are an annotation layer produced by an agent and signed separately.
4. **Redaction safety.** Selective disclosure shows that something was withheld; disclosure granularity
   and context loss are discussed in the spec, with the sertraline-style example as a test case.
5. **Recall-first population search.** Per-criterion union of structured and text matches, then
   intersection, then verification. Lexical search must handle synonyms/brands/abbreviations and
   negation is left to the verifier; costs are reported honestly.
6. **Agent-to-agent is specified.** A concrete message envelope, published contracts, explicit
   human-sign-off points. Avoid name collision with Google's A2A (call ours something else, or build on it
   — decide in Stage 6).
7. **No waveform/WASM work** unless a later stage finds a real reason.

## 4. Repository layout (initial; expected to evolve)

```
folio/
├── PLAN.md                 this file
├── spec/                   normative draft: record item, schema conventions, sync, signing, agent messages
├── truth/                  clinical-truth model + generator (source-neutral) + answer keys
├── sources/
│   ├── <ehr-a>/            schema .d.ts, renderer truth→items, sync node
│   ├── <ehr-b>/
│   ├── <ehr-c>/
│   └── patient-app/        patient-generated data + Personal Agent
├── packages/
│   ├── core/               item parse/serialize, ref extraction, SD-JWT, did:web, sync client
│   ├── agent-runner/       claude -p / codex exec / tmux backends, run recording + replay
│   ├── compiler/           mapper compilation loop, cache by schema hash, checks
│   ├── views/              target view .d.ts (+ US Core FHIR target)
│   ├── funnel/             population search
│   └── exchange/           agent-to-agent protocol
├── runs/                   recorded agent runs (committed selectively; replay source for the site)
├── site/                   workbench UI + essay + spec pages (static build)
├── background/             earlier drafts
└── vendor/my-ehi/          real Epic export (git-ignored; used in late stages)
```

Stack: Bun + TypeScript, DuckDB for SQL, ripgrep for text, `jose` + an SD-JWT library, Vite/React for the
site. Defaults, revisable.

## 5. Stages

Each stage ends at a **gate**: I stop, report what exists, how it was checked, what surprised us, and the
decisions needed. Stages say what "done" looks like, not every step; iteration inside a stage is expected.

### Stage 0 — The readable core (design on paper, small code)

Goal: the three source schemas, the record format, and the hero story are clear and pleasant to read
before anything is built on them. This is where the project's readability is won or lost.

Work:
- Hero patient narrative: ~5 years of cardiometabolic care across the three EHRs and the patient app;
  choose the subplot (candidates: new cancer diagnosis → trial pre-screen; SGLT2/metformin adverse event
  → specialist referral). A one-page timeline.
- Three EHR modeling styles, each 10–20 types, each with honest docstrings:
  - **A, encounter-document style** (hospital/specialty): one item per encounter, rich prose, nested payload.
  - **B, event-log style** (primary care): many small items (each vital, each med change), terse prose.
  - **C, coded-tables style** (lab/ancillary-flavored clinic): lookup codes, status integers, units in
    separate fields; little prose.
- Plant the traps (list in `truth/TRAPS.md`): status codes, unit shifts, superseded/corrected results,
  negation/rule-outs, prose-only facts, held vs discontinued, duplicates across sources, local codes
  without standard codes, a few quirks borrowed from the Epic export (text-typed numbers, soft deletes).
- Spec draft v0: record item envelope + Markdown form, `<ref>` rules, schema conventions (discriminated
  unions, required docstrings, unit fields).
- 3–5 hand-written example items per source.

Gate 0 (you review): read the schemas and examples. Questions to answer: Is each source readable in ten
minutes? Are the styles different enough to be interesting and realistic enough to be credible? Are the
traps the right ones?

### Stage 1 — Clinical truth and corpus

Goal: a generator that produces the hero plus a population, with answer keys.

Work:
- `truth/` model + deterministic generator (seeded) for ~300 patients; the hero and 3–5 secondary
  patients hand-tuned. Prose rendered by templates for the population, by an LLM (recorded) for the hero
  and secondaries.
- Renderers truth → items for A, B, C, patient app. Each patient appears in 1–3 sources.
- Answer keys per patient per view (active meds, problems, latest labs, …) and per cohort query.
- Corpus sanity checks: every trap actually appears; items validate against their `.d.ts`.

Gate 1: browse the hero's logs in each source; trap coverage report; corpus size (aim: whole corpus
readable with `rg`, small enough to commit).

### Stage 2 — Wire, sync, trust

Goal: items move between systems with provenance intact and can be partially disclosed.

Work:
- `core`: parse/serialize, ref extraction with offsets, JSON form, SD-JWT signing per ref span,
  presentations with chosen spans, verification against `did:web` (local resolver for dev).
- Each source runs a sync node (`GET /patients/{id}/sync?since=`), plus schema hosting by hash.
- Personal Agent CLI: sync from all sources, verify, store a local log.
- Spec: sync API and signing/disclosure profile.

Gate 2: tamper tests pass; a redacted presentation verifies; a `bun` command syncs the hero from all
four sources. Small, mostly mechanical stage — candidate to run in parallel with Stage 1.

### Stage 3 — Agent runner and compiler loop (the central claim)

Goal: from schema + samples alone, CLI agents produce mappers into the target views, checked and
cached.

Work:
- `agent-runner`: a task = workdir + instructions + allowed tools + expected outputs. Backends:
  `claude -p` (stream-json), `codex exec`; optional tmux session for watching live. Every run writes a
  record (prompt, transcript, files produced, timings, model) under `runs/` for replay.
- `compiler`: for each (source schema hash, target view) → agent writes `transform.ts` + its own tests →
  harness runs `tsc`, the agent's tests, and **independent checks**:
  1. answer keys from `truth/` on held-out patients (primary),
  2. prose cross-check where narrative exists (an independent agent reads only the prose),
  3. reported separately for structured-only vs narrated items.
  Failures feed back to the agent for a bounded number of rounds. Passing mappers cached by schema hash.
- Second target: US Core FHIR for at least meds and labs.
- Backend comparison: same tasks under claude and codex.

Gate 3 / **decision point**: scorecard of compile rate, silent-error rate per trap, prose-check
contribution, structured-only vs narrated. If silent errors stay high on some trap, decide: improve the
docs convention (spec change), add a check, or present it honestly as a limit.

### Stage 4 — Workbench v1 (first showable milestone)

Goal: something you can put on screen and the public can poke.

Work:
- Static site: patient timeline merged across sources through compiled mappers; click a structured fact
  → highlight its `<ref>` span and show signature status; redaction toggles with live verification;
  compiler tab showing schema → mapper → check results, replaying recorded runs (live mode when run
  locally with a CLI agent available).
- Deploy to joshuamandel.com/folio.

Gate 4: you click through it as the talk would. Decide whether the story works before broadening.

### Stage 5 — Population search

Goal: cohort queries across all sources with honest recall/precision against answer keys.

Work: per-criterion SQL (DuckDB over items flattened to Parquet/JSON via compiled mappers *or* raw
payloads) ∪ ripgrep text matches, intersect, verify the survivors with CLI agents citing
`(item id, ref id)`; funnel tab in the workbench. Include the prose-only-fact patients as the recall test.

Gate 5: measured recall/precision/cost per stage for 3–5 cohort queries.

### Stage 6 — Agent-to-agent workflow and write-back

Goal: one conversational workflow end-to-end, specified in `spec/`.

Work: published contract (intake or trial pre-screen, per the subplot) + message envelope; clinic agent
fills it from the log with selective disclosures; counterpart asks a clarifying question routed to the
patient app; human sign-off points explicit. Patient-app home BP write-back staged in an EHR via its
compiled mapper.

Gate 6: recorded runs replay in the workbench; spec section reviewed.

### Stage 7 — Documentation benchmark and Epic contrast

Work:
- Ablation tiers per source (full docstrings → types only → cryptic keys → no refs); rerun Stage 3;
  scorecard tab.
- Epic contrast node: project a curated slice of `vendor/my-ehi` (meds, problems, a few notes) into
  FOLIO items with generated `.d.ts` from Epic's column docs; agent-authored `<ref>` annotation layer;
  compare against `~/hobby/ehi-to-fhir` and Epic's own FHIR output. Point: the idea survives the extreme
  case, and what it costs there.

Gate 7: scorecards; decide what goes in the essay.

### Stage 8 — Essay and launch

Rewrite the manifesto from results; publish spec, workbench, essay together.

## 6. How we will know it worked

- A newcomer reads one source's schema + one item and explains it correctly (we test with a fresh agent
  and with you).
- Compiled mappers reproduce the answer keys; silent-error rate is reported per trap, not averaged away.
- The hero's merged chart in the workbench is correct against `truth/`, and every displayed fact traces
  to a signed span.
- A redacted presentation verifies and visibly marks what was withheld.
- Population queries report measured recall/precision, and the prose-only patients are found.
- Every agent result in the site is a replayable recorded run from this repo.
- The spec is short enough to read in one sitting and matches the code.

## 7. How I will coordinate the work

- I stay the orchestrator and keep my own context for decisions, gates, and the spec's coherence.
- Work goes to subagents with written briefs; each writes its outputs to files and returns a short
  receipt (what was produced, how checked, open questions). I read receipts and spot-check, not full
  dumps.
- Parallel work in separate git worktrees when tasks touch disjoint paths (e.g. Stage 1 and Stage 2).
- For each stage, an independent reviewer agent checks claims against the repo before the gate report.
- Briefs and receipts are kept in `work/` (git-ignored or committed, decide at Stage 0) so later agents and
  sessions can pick up context without me re-explaining.

## 8. Open questions (to settle at or before the gates)

- The subplot (Stage 0).
- Name for the agent-to-agent protocol (Stage 6).
- Population size and how much prose is LLM-written vs templated (Stage 1; cost/realism tradeoff).
- Which SD-JWT library; did:web resolution for localhost and for the public site (Stage 2).
- Whether the public site offers any live mode at all (Stage 4).
- How much of `runs/` to commit (size).
