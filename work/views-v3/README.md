# Views v3

`packages/views/views.d.ts` (copied from `views.d.ts` here) was written blind: a fresh claude opus agent in the
compile sandbox, with only `brief.md` (output semantics in generic words, by the harness author) and
`skeleton.d.ts` (the v2 types with every comment removed) as input. It never saw sources/, corpus/, truth/ or the
generator. Runs: see `run.txt` (the first writes the file; a second, also blind, replaced two examples that named
drugs which happen to coincide with corpus cases: sertraline and ibuprofen; it was told only to avoid those names).

`views.leakcheck.json`: every quoted string, backticked string and number-with-unit in the v3 docstrings, checked
with `rg -F` against sources/, packages/truth, packages/render and corpus/ (`bun packages/compiler/src/cli/leakcheck.ts`).
The strings that occur there are the skeleton's own field values and analyte names (required), generic terms
("active", "held", "nightly", "no known allergies", "penicillins", unit names, date-format masks), and arithmetic
examples ("1 lb", "5.5 mmol/L", "154 lb", "10 mg", "500 mg", ">90"). The brief itself names ">90", "nightly" and "at
night". No source field name, code value, label or corpus-specific phrase appears; no drug from the corpus catalog
is named.

`packages/views/v2/views.d.ts` is views v2 (written by the corpus author, with source knowledge), kept as the "views
with source hints" condition (view set `appv2`).
