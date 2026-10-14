# Read clinical notes and state their facts

Each file in `in/notes/` is the narrative of one clinical record item: a note, a comment, a diary entry.
Spans marked `<ref id="…">…</ref>` are the parts the author tied to structured data (you do not see
that data). Read each narrative and write down the facts it asserts, in the terms of the consumer views
defined in `in/views/views.d.ts` (medications, problems, allergies, labs, vitals). The header of each
note gives the organization and the note's date.

Write `out/facts.json`: `{ "items": [ { "item_id": "...", "facts": [Fact, ...] }, ... ] }` with one entry per note
(an empty `facts` array if the note asserts nothing these views cover). A Fact is one of:

- `{ "view": "medications", "ingredient": "finerenone", "status": "active"|"held"|"stopped", "dose"?: {"value": 10, "unit": "mg"} }`:
  the status as of the note's date, by this organization's account, using the meanings in
  `MedicationRow.status` (held = paused, not stopped). Give a dose only if the note states the current one.
- `{ "view": "problems", "condition": "...", "icd10cm"?: "...", "status": "active"|"resolved"|"ruled_out", "ckd_stage"?: "G3b" }`:
  include conditions the note says were ruled out, as "ruled_out".
- `{ "view": "allergies", "substance": "lisinopril", "reaction_type": "hypersensitivity"|"side_effect"|"serious_adverse_event" }`
- `{ "view": "labs", "analyte": "potassium", "value": 5.8, "comparator"?: "<"|">", "date"?: "YYYY-MM-DD" }`: analyte
  names and units as in the `Analyte` table (convert units); `date` = local collection date if stated.
- `{ "view": "vitals", "systolic_mmhg": 138, "diastolic_mmhg": 84 }`: blood pressure measured at this encounter.

Every fact also has `"ref"` (the ref id it comes from, or null) and `"quote"` (the words it rests on).
Only facts the narrative itself asserts about this patient now; not plans for the future, not other
patients, not your own clinical inference. When unsure, leave it out.

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
