# Brief: write the consumer views file

You are writing `views.d.ts` for a patient-facing chart application (the "consumer"). Health organizations
publish a patient's records as **record items** (shape: `FolioItem` in the skeleton). For each organization, a
separate program (a "mapper") will later be written that turns that organization's items for one patient into
the rows defined here. You are writing the specification those mapper authors will read. They will see your
file, the organization's own schema, and a few sample items; nothing else.

`in/skeleton.d.ts` has every type, field name and allowed value, with no documentation. **Keep every name, type
and allowed value exactly as it is** (other software depends on them). Your job is the documentation: a module
comment, and a docstring on every type and field, following the semantics below. Where a sentence would need an
example, invent one or take it from an unrelated area of medicine (asthma, orthopedics, dermatology, infections
…). Do not use diabetes, kidney disease, blood-pressure or cholesterol medicines as examples. Write plainly; no
marketing tone.

## Record items, in brief

- An item has an envelope (`id`, `issuer`, `patient`, `effective` = when the clinical event happened,
  `recorded` = when the organization committed the item), an optional Markdown `narrative` with `<ref id>` spans,
  and a `payload` of entries typed by the organization's own schema.
- Items are never edited. `supersedes: [ids]` means this item replaces those items entirely (corrections,
  amendments, re-statements). Supersession is transitive. `retracts: [ids]` means those items were entered in error
  and nothing replaces them. Both only refer to items of the same issuer.
- A change in clinical state (a medicine paused, a problem resolved) is a new fact in a new item, not a supersession.

## Contract

`transform(items, asOf)` gets every item one organization published for one patient (any order, including
superseded and retracted ones) and a local date `asOf` (`YYYY-MM-DD`). It returns `ViewRows`: the rows describing
that organization's record as it stood at the end of that day. Empty arrays where the organization has nothing.

## Semantics every view shares (state them in the module comment)

- **As-of.** An item counts when its `recorded` time is on or before the end of `asOf` in the consumer's time zone.
  Among those, superseded and retracted items do not count.
- **Time zone.** The consumer's time zone is America/Chicago. "Local date/time" means wall-clock time there. A
  date-time with no offset and no zone is taken to be local time already: report it as written, never shift or
  drop it.
- **Partial dates.** A date may be just a year or a year and month; keep exactly the precision the source has, never
  pad.
- **Only what this organization records.** No inference from other organizations, no correcting the source. Rows come
  from structured payload entries; narrative may help interpret an entry but is never the only basis for a row.
- **Evidence.** Each row lists the items (and entry ids) it rests on; at least the item that gives its current state.
- **Sensitive entries.** Report everything, including entries the organization marks restricted or confidential;
  tag them with `sensitivity` (categories as in the skeleton: mental health, substance use, sexual and reproductive
  health, HIV and other sexually transmitted infections, genetic). Set a category when the source marks the entry as
  such (map the source's own category) or when the entry plainly belongs to one. Never drop a row because it is
  sensitive: whether to show or share it is the patient's later decision.
- **Determinism.** Same input, same output: no clock, randomness, network or files.

## Medications (`MedicationRow`)

- Outpatient (home) medicines only; hospital-only orders (infusions, inpatient-only drugs) are not rows.
- One row per drug ingredient. If the source has several lines/orders for one ingredient over time, report the most
  recent one (the one whose own latest event is latest). A line or order entered in error never existed.
- Include stopped medicines the source still shows.
- If the source publishes its list as repeated snapshots, the latest in-scope snapshot is the list; a drug absent
  from it is not reported. If the source publishes events or status changes, the latest event for a line decides its
  state, however old.
- `ingredient`: generic ingredient name, lower case, no salt or dosage form; translate brand names. Omit only when the
  record does not say which drug it is.
- `rxnorm_ingredient`: only when the source states an ingredient-level code; never guessed.
- `status`: active (should be taking / patient says taking); held (paused with intent or possibility of resuming; not
  taking now; distinct from stopped); stopped (discontinued); unknown (listed with no decision recorded, e.g. a list
  explicitly marked as not reviewed). On a patient's own list, an entry marked as taken but annotated by the patient
  as paused or stopped for the time being is held.
- `status_since`: local date the current status began per the source (hold or stop date; for active, start or resume
  date); source precision; omit if unknown.
- `dose`: amount per administration currently prescribed (for held/stopped: when held/stopped); on a patient's own
  list, the amount the patient says they take. If a direction gives no count but names a time ("in the evening"),
  that is one unit (one tablet). If the record gives strength per tablet and a number of tablets, report the mass
  (strength × count). Use unit 'tablet' only when the strength is unknown. Normalize unit spellings to the listed
  units. Omit when there is no single amount: a range, a sliding scale, a condition-dependent amount, or a strength
  with no directions at all.
- `frequency`: QD once daily, BID twice daily, TID three times daily, QHS once daily at bedtime, QW weekly, PRN as
  needed, other. A once-daily direction given only as "nightly" or "at night" may be reported as QHS or QD; both are
  accepted.
- `stop_reason`: only for stopped rows, only when the source gives a coded or clearly stated reason (list values as in
  the skeleton).
- `status_reason_text`: the source's free-text reason for the current status.
- `patient_reported`: true for a patient's own account (self-reported list), false for a clinician's record.
- `otc`: true when the source says it was bought without prescription.
- If a patient's own list names the same drug twice with conflicting statuses, report one row for it; this view does
  not specify which entry wins.

## Problems (`ProblemRow`)

- Conditions the source asserts the patient has or had. One row per condition; restaged or recoded entries are one
  row with the latest wording, codes and stage.
- Never report a ruled-out condition, or one only suspected (working, provisional) and never confirmed.
- A diagnosis recorded only to bill an encounter is not a problem-list entry unless the source says its problem list
  is built that way.
- A diagnosis the source attributes to a drug (named drug or drug class, or an "adverse effect of <drug>" code) yields
  an allergy/intolerance row for the drug (see there) in addition to a problem row for the condition it caused; a code
  that names only the adverse effect and no condition yields the allergy/intolerance row alone.
- `status`: active or resolved (the source says resolved or historical).
- `onset`: with the source's precision; omit if unknown.
- `ckd_stage` / `albuminuria`: for chronic kidney disease only; the KDIGO GFR category (G1…G5, with G3a/G3b) and
  albuminuria category (A1–A3) the source most recently recorded, as recorded by a clinician (from wording, a code, or a
  category field); never computed from lab values.

## Allergies and intolerances (`AllergyIntoleranceRow`)

- A list of substances to avoid because of a past reaction. It makes no claim about mechanism. Only current entries;
  "no known allergies" is not a row.
- Substance for a drug-attributed diagnosis: the specific drug when the record names it; when it names only a drug
  class, the one drug of that class on the patient's medication list in the same item if there is exactly one,
  otherwise the class as written.
- `substance`: generic ingredient name, lower case, for single drugs; as written otherwise.
- `reaction_type`, by what happened, not by which list the source keeps it on and not by mechanism:
  hypersensitivity (hives, rash, swelling of lips/face/tongue, anaphylaxis, bronchospasm — whatever the mechanism);
  side_effect (predictable, non-dangerous effect that made the drug unacceptable, e.g. a cough, stomach upset, muscle
  aches); serious_adverse_event (serious harm attributed to the drug that is not a hypersensitivity-type reaction,
  e.g. a drug-induced metabolic emergency or organ injury). If the source keeps everything on one undifferentiated
  list, decide from the recorded reaction.
- `mechanism`: immune only when the source (or a confirmed allergy test) says so; non_immune when known not to be
  (e.g. well-established non-immune drug effects); unknown when not established — use it when in doubt.
- `reaction`: the source's wording, joined with "; ".
- `criticality`: high (re-exposure could be serious or life-threatening), low, unknown; map a source's "severity"
  scale by meaning (mild → low; severe or life-threatening → high).
- `onset`: source precision.

## Lab results (`LabResultRow`)

- Only the listed analytes, each in a fixed unit (put this table in the docs): creatinine mg/dL; egfr
  mL/min/1.73m2; potassium, sodium, chloride, bicarbonate (total CO2), anion_gap mmol/L; bun (urea nitrogen) mg/dL;
  glucose (laboratory, not home meter) mg/dL; a1c % (NGSP); uacr (urine albumin/creatinine) mg/g; platelets and wbc
  10*3/uL (thousands per microlitre: a count of 350 000 cells/uL is 350); hemoglobin g/dL; bhb (beta-hydroxybutyrate)
  mmol/L; ph [pH]; pco2 mmHg; lipase U/L; troponin (troponin I) ng/mL; cholesterol (total), triglycerides, hdl, ldl
  (measured or calculated) mg/dL. Convert to these units.
- One row per result; a result shown several times (copies in several items, a preliminary then a final copy) is one
  row, from the copy with the most advanced status.
- Only values that stand: leave out results withdrawn, invalidated or corrected away by the lab, results of orders
  voided or entered in error, results not performed, and superseded copies. A confirmation repeat is a second valid
  result.
- eGFR: one row per calculation the source reports for a specimen; when the source reports variants of one
  calculation with and without a race coefficient, report only the one without. Report the value as printed, do not
  recompute. `egfr_equation`: the equation the source says it used (unknown if not stated).
- `value` numeric in the analyte's unit; `comparator` when printed with one (">90" → 90 and '>').
- `collected`: specimen collection time, RFC 3339 with offset. `status`: final (also amended/corrected values that
  stand) or preliminary. `loinc` if given.

## Vital signs and home readings (`VitalRow`)

- `setting`: clinic, hospital (emergency or inpatient), home (patient's own devices).
- A clinic or hospital vital-sign set (taken within a few minutes at one visit) is one row; `local_time` is the time of
  its first blood pressure (or first measurement); a repeat blood pressure later in the visit goes in `repeat_*`.
- Each home reading is its own row. Each measurement once: a hand-entered reading that duplicates a device reading a
  minute or two earlier with the same values is reported once, preferring the device copy.
- `local_time`: `YYYY-MM-DDTHH:MM` in the consumer's zone. Weight in kg (1 lb = 0.45359237 kg, one decimal). Home
  glucose in mg/dL (1 mmol/L = 18.016 mg/dL, whole number); `glucose_out_of_range` when the meter showed HI or LO
  (value then the meter's limit in mg/dL).

## Output

Write `out/views.d.ts`: the skeleton, unchanged in names, types and values, with complete documentation. Keep the
documentation concrete and short; every field gets a docstring. Then stop.
