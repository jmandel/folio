# Verdicts on three answer-key changes

| # | Change | BEFORE justified | AFTER justified | v2 key faithful |
|---|---|---|---|---|
| 1 | One row per ingredient | no | yes | partly |
| 2 | HomeLog paused medicine → `held` | ambiguous | yes | yes |
| 3 | Riverside drug-caused diagnosis → allergy row | ambiguous | no | partly |

---

## 1. One row per ingredient

**BEFORE: not justified. AFTER: justified.** Views v1 says this directly (`views-v1.d.ts:84-87`):

> One row per drug ingredient. If the source has several lines, orders or prescriptions for the same ingredient over
> time (stopped and restarted, re-entered), report the most recent one, i.e. the one whose own latest event is latest.

The old key could hold two rows for one ingredient, which contradicts this. Northgate already grouped its lines by
ingredient (`keys-before-changes.ts:163-174`). Lakeview, Riverside and HomeLog did not. The new reduction
(`keys-after-changes.ts:132-139`) groups rows by ingredient, or by the name as written when the ingredient can't be
derived. Its recency order for Northgate (`ms(cur.at)`) and Lakeview (`sortKey(last.at)`) is "latest own event", as
the view requires.

**v2 key: partly faithful.** `views-v2.d.ts:104-107` repeats the rule word for word, and `keys-v2.ts:151-158` keeps
the same code. Three details aren't grounded in the views:

- **HomeLog recency.** The key ranks entries by `order = (stopped ? 0 : 1000) + list index` (`keys-v2.ts:502`).
  "Taking beats stopped" is a fair reading. List position as a tiebreak isn't documented anywhere in `homelog-v1.d.ts`.
  The view's "own latest event" points to the entry's own `started`/`stopped` dates (`homelog-v1.d.ts:213-217`).
- **Riverside ties.** Riverside rows carry no `order`, so ties fall to truth-medication order. That choice is arbitrary.
- **Reduction runs before the scope filter.** The one-per-ingredient reduction (`keys-v2.ts:151-158`) runs before the
  publication-scope filter (`159-162`). Suppose the newer line's items weren't recorded by `asOf`. The newer line wins
  the reduction and is then filtered out. The older, published line has already been discarded, so the ingredient
  vanishes, but a mapper following the views would report the older line. This is an edge case, but it's a real
  ordering bug.

**Reasonable alternative readings:**
- Rank duplicate HomeLog entries by their `started`/`stopped` dates.
- Read v1:88-89 ("include stopped medications the source still shows") as keeping a stopped duplicate. This is weak,
  because the more specific rule wins.
- For two simultaneous strengths of one ingredient, keep one row and omit `dose` ("no single amount", v1:129).

## 2. HomeLog: `taking` + "doctor told me to stop for now"

**BEFORE: ambiguous. AFTER: justified.**

- **Case for `active`.** v1:111 defines `active` as "the patient should be taking it (or, on a patient's own list,
  says they are)". Read literally, that covers the coded status `taking`, so BEFORE is a defensible literal mapping.
- **Case for `held`.** v1:112-113 defines `held` as "paused with intent (or at least possibility) of resuming; the
  patient should not be taking it now". The note fits almost word for word: a clinician said stop, and "for now" means
  a possible resume.
- **What settles it.** The source schema warns that the coded status is unreliable for exactly this case
  (`homelog-v1.d.ts:208-209`): "HomeLog has no 'paused' status; patients usually mark a paused medicine 'stopped' and
  explain in `note`, or leave it 'taking'."
- **The note is usable.** `note` is a structured payload field (`homelog-v1.d.ts:225-226`), so the v1:25-26 limit on
  narrative doesn't apply. The patient's own words also mean they no longer "say they are" taking it.

AFTER is the better-supported reading. BEFORE was a reasonable literal reading, not an error.

**v2 key: faithful.** `views-v2.d.ts:137-138` now states the rule, and `keys-v2.ts:495-501` implements it: a
`taking` entry whose note matches `/stop for now|on hold|paused/` becomes `held`, with no `status_since` because the
list gives no hold date. The regex is narrower than v2's wording ("stopped for now" wouldn't match). The generator only
ever writes the exact phrase "doctor told me to stop for now" for held medications (`generator-excerpts.ts:18`), so on
this data the implementation is faithful.

**Reasonable alternative readings:**
- `active`, with the note in `status_reason_text`.
- `stopped`: the patient says they stopped, and per the schema paused medicines are usually filed as stopped. This is
  weaker, because "for now" means a possible resume.
- `unknown`, because the coded status and note conflict. This is weak, because `unknown` is reserved for lists that
  record no decision.

## 3. Riverside: drug-attributed diagnosis → allergy row

### BEFORE: ambiguous

Two documents point in different directions:

- **For an allergy row.** v1:171-173: "An adverse effect of a drug (however the source records it, including as an
  ICD-10 T-code diagnosis) is an `AllergyIntoleranceRow` of type 'adverse_reaction' … The illness it caused (e.g.
  ketoacidosis) is still a problem." "However the source records it", with ketoacidosis as the example, suggests that
  "Euglycemic DKA, SGLT2 inhibitor-associated" should produce an allergy row.
- **Against.** `riverside-doc-v1.d.ts:116-118` says Riverside codes an adverse drug effect "as its own diagnosis (an
  ICD-10 T-code), not as an allergy". A mapper could reasonably treat only T-code entries as adverse effects and the
  drug-attributed label as just a problem.

### AFTER (v1 key): not justified

Producing a row at all is defensible. The details of the rule are not:

1. **Substance comes from the truth.** The diagnosis names only a class.
   - v1:4-7 says the mapper "never invents, infers from other sources".
   - v1:209 says substance is "generic ingredient name … for drugs; as written otherwise". Read literally, that gives
     "SGLT2 inhibitor" / "ACE inhibitor".
   - Narrowing to the single same-class drug on the document's home list is a plausible in-source inference, but v1
     never states it.
   - For angioedema, the truth allergy's substance is hard-coded to lisinopril (`generator-excerpts.ts:37`), while the
     patient's actual ACE inhibitor is `home(["acei"])[0]` (line 32). If those differ, the key expects a drug Riverside
     never names.
2. **The row's existence depends on another source.** The truth allergy, and so the row, exists only `if (ax.inB)`,
   i.e. when Northgate later recorded the reaction (`generator-excerpts.ts:38-40, 63-71`). For a patient Northgate
   doesn't know, identical Riverside documents yield no row. A per-source key can't depend on that.
3. **No check on status or label.** Any dx entry for the manifesting condition triggers the row, whatever that
   document's label or status (working, ruled out).
4. **Type `allergy` for ACE-inhibitor angioedema is ambiguous under v1.**
   - v1:215 lists angioedema under `allergy` ("immune-mediated").
   - v1:171-172 says a drug's adverse effect is `adverse_reaction`, and ACE-inhibitor angioedema is not
     immune-mediated.
   - `adverse_reaction` for DKA is supported (v1:218-219).

### v2 key: partly faithful

Views v2 states the rule:

- `views-v2.d.ts:198-202`: a drug-attributed diagnosis yields an allergy row in addition to the problem row.
- `views-v2.d.ts:240-243`: substance is the named drug; otherwise the single same-class drug on the same item's
  medication list; otherwise the class as written.
- `253-258`: `reaction_type` (ACE-inhibitor angioedema → `hypersensitivity`, ketoacidosis → `serious_adverse_event`).
- `265-266`: `mechanism` (`non_immune` for both).

`keys-v2.ts:391-414` implements the core faithfully. It matches class labels, skips working and ruled-out diagnoses,
picks the substance from the encounter's re-listed home list (`homeList`, 351-357) or uses the class string, sets
`reaction_type` per class, and no longer depends on a Northgate-recorded truth allergy.

Remaining gaps:
- **(a) Possible duplicate rows.** The dx loop calls `seen.add` but never checks `seen` (`keys-v2.ts:412`). If a later
  Riverside allergy list already carries the same allergy, the key expects two rows for one substance, although the
  view is "One substance the patient should avoid" (v2:236). The AFTER key avoided this with
  `if (!a || seen.has(a.id)) continue`.
- **(b) Named drugs only via the class regex.** "Specific drug when the record names it" is handled only through the
  class regex (or the truth `subtype`), not an ingredient named in the label.
- **(c) Encounter-level list.** The key uses the encounter-level renderer list rather than the item's own `home_med`
  entries. These are identical under the generator's re-listing rule.
- **(d) Lenient mechanism.** `mechanism` accepts `unknown` as well as `non_immune`, although v2 explicitly says
  `non_immune` for both cases. This is defensible under "Use this when in doubt".

**Reasonable alternative readings (v1):**
- No row: only T-code entries count.
- A row with the class as written as the substance.
- A row with the single same-class home-list drug as the substance (later the v2 rule).
- `adverse_reaction`, not `allergy`, for ACE-inhibitor angioedema.

**Under v2:** merge with an allergy-list row for the same substance.
