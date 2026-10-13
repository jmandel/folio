# Northgate (B): design notes and spec issues

> Stage 0c: the problems below were resolved (or left open) in `work/decisions.md` under "Stage 0c";
> see `work/stage0c-receipt.md` for what changed. This file is kept as the Stage 0b record.

## Decisions the story did not settle

1. **Finerenone is an outside med line in B.** T16 says B has a finerenone import from C with only a
   local drug id; HERO's timeline says B imports only the 2026-09-14 result. I reconciled them: B adds
   finerenone as `med_event` `start`, `origin: "outside"`, `drug.outside_code`
   `{system: "lakeview-drug", code: …}`, no RxNorm, at a reconciliation after the 2026-07-13 nephrology
   visit (suggest 2026-07-20, phone, no visit). B never records the 2026-09-14 hold, so **B's replayed
   list shows finerenone active**. That is a second T1/T5-style staleness (outside lines lag). The answer
   key is unaffected (C's hold is later and authoritative), but the generator should know B says active.
   Orchestrator: confirm, or drop the outside line and move T16's drug half elsewhere.
2. **B never records the hospital hold of empagliflozin.** Its log goes `start` (2023-03-06) → `stop`
   (2024-11-12). Between 11-02 and 11-12, B's list says active while A says held. Consistent with HERO.
3. **Imported result granularity: one item per Lakeview accession**, one entry per component, not one
   item per component. Keeps the T11 eGFR pair visible in one file. Still "small" (a BMP is ~8 entries).
4. **K 6.1 correction path.** HERO says B's copy is "later retracted"; TRAPS T3 says "`supersedes` +
   `retracted`". I used retraction only: Lakeview's correction withdraws the value without a new one
   (the 4.6 is a separate redraw accession), so nothing supersedes it. Rule in the schema: correction
   with a new value → `supersedes`; withdrawal → `retracts` + `chart_correction` `source_corrected`.
   TRAPS T3 wording should be fixed to match.
5. **Onset stored as full date + precision** (Epic-style accuracy flag) rather than as a partial date
   string, even though decisions.md now allows partial dates. Rationale: that is how the source stores it,
   and it is exactly the T10/T17 trap ("2016" read as 2016-01-01). The envelope still uses a full
   date where the event date is known.
6. **Added `list_reviewed`** (not in the brief) because "problem list reviewed" stamps are what make a
   stale line look current in real primary-care data; it sharpens T5. Suggest the generator emit one at
   the 2026-05-04 referral visit listing `PL-11902`.
7. **Visit billing diagnoses** (`visit.billing_dx`) are separate from the problem list and include Z codes
   and E11.22 while the problem list says E11.9-level "Type 2 diabetes". A mild extra trap (billing dx
   read as problems); not numbered. Drop if it distracts.
8. **Sick-day rules** are a narrative-only span (`sick_day`) so the intake exchange can disclose that one
   sentence alone (HERO exchange question 4).
9. **The B note does not mention the DKA precipitant.** HERO's modality matrix puts it in A and P only;
   keeping B silent preserves T13.
10. **Identifiers**: Lakeview codes I invented for the 2021 rows (`LK-CREAT`, `LK-EGFR09N`, `LK-EGFR09A`)
    and accession format `LV21-263-00417` must be reconciled with source C's schema. RxNorm/SNOMED codes
    used (29046, 1545658, 700378005, N18.31) should be double-checked before Stage 1.
11. **Vitals**: BP as text `"152/94"` (flowsheet style); weight in lb as a number. I did not plant Epic's
    weight-in-ounces quirk; it would be credible if we want another unit trap.

## Spec problems hit

1. **Retraction items and `effective`.** `effective` is required, but what is the clinical time of a
   void? I used the time of the void. The spec should say (void time, or copy the retracted item's
   `effective`?). Same question for `recorded` vs `effective` on system-filed imports.
2. **Retraction with a payload is redundant.** My `chart_correction.voided_items` must equal envelope
   `retracts`. The spec allows payload on a retracting item but does not say whether it may restate
   the retracted ids, or what a reader does if they disagree. Suggest: envelope is authoritative;
   schemas MAY echo it.
3. **Envelope `effective` vs payload times.** For imported results, `effective` = collection time and
   the payload repeats `collected`. Spec could say that payload times are allowed to repeat envelope
   times and which wins (envelope, presumably) — or recommend not repeating.
4. **Grouping across items.** Event-log style needs `visit_id` on most entry types; this is fine under
   "sources group in payloads", but a timeline UI will want to cluster a visit's six items. Supports
   revisiting the encounter hint later (decisions.md).
5. **Narrative-only span vs payload-less item.** A visit note whose only payload is the `visit` header is
   fine, but the spec's "ref id SHOULD name a payload entry" reads as discouraging `sick_day`. Worth an
   explicit example of a narrative-only span used for disclosure granularity.
6. **Cross-issuer pointers in payloads.** `external_ref` points at Lakeview's accession, not at a FOLIO
   item id (B does not know C's ULIDs). The spec mentions refs by `issuer` + `id`; it should say that
   source-native foreign keys are also normal and that dedup across issuers is a consumer concern.
7. **`schema-conventions.md` example uses `action: 'stop'` while TRAPS T1 says B's event is `med.stop`.**
   I used `med_event` + `action: 'stop'`; TRAPS wording should follow the schema.
