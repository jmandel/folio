# Views v3

`packages/views/views.d.ts` (copied from `views.d.ts` here) was worded by an agent that saw no source, data or
generator (a fresh claude opus agent in the compile sandbox), working from a brief by the corpus author that restates
each source's quirks in general terms: `brief.md`, plus `skeleton.d.ts` (the v2 types with every comment removed).
Examples of source knowledge the brief carries: a patient-list entry "paused or stopped for the time being" is held; a
time with no count means one tablet, strength × count, no dose without directions; "nightly" may be QHS or QD; a list
"explicitly marked as not reviewed" is unknown status; billing-only diagnoses are not problems; the substance rule for
diagnoses attributed to a drug class; CKD stage from "a category field"; a count of 350 000 cells/uL is 350; the eGFR
race-coefficient rule; a hand-entered reading that duplicates a device reading; zone-less times; HI/LO; 18.016. So v3
does not measure reading a source schema without help: it carries the same source knowledge as v2 in general wording,
without the corpus's strings. The leak check below is literal (quoted strings), so it cannot catch paraphrased rules. Runs: see `run.txt` (the first writes the file; a second, also without access to sources, replaced two examples that named
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
