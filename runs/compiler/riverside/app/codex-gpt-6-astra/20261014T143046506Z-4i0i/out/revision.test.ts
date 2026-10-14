import { strict as assert } from "node:assert";
import type { FolioItem } from "../in/views/views";
import { transform } from "./transform";

const item = (id: string, kind: string, effective: string, recorded: string, entries: Record<string, unknown>): FolioItem => ({
  folio: "0.1", id, issuer: "rrh", patient: "p", effective, recorded, narrative: "", payload: {
    enc: { type: "encounter", encounter_id: "stay", document_kind: kind,
      class: kind === "ed_note" ? "emergency" : "inpatient", service: "Medicine",
      arrived: "2025-06-01T06:00:00Z", ...(kind === "ed_note" ? {} : { admitted: "2025-06-01T10:00:00Z" }) },
    ...entries,
  },
});
const vital = (taken: string, systolic: number, diastolic: number) => ({
  type: "vitals", taken, bp: { systolic_mmhg: systolic, diastolic_mmhg: diastolic },
});
const first = vital("2025-06-01T06:10:00Z", 150, 90);
const repeat = vital("2025-06-01T08:10:00Z", 130, 80);
const ward = vital("2025-06-01T10:10:00Z", 120, 75);
// The H&P is committed first and copies the ED readings. The ED note is signed
// late, but still identifies which observations belong to the ED examination.
const hp = item("hp", "hp", "2025-06-01T10:20:00Z", "2025-06-01T11:00:00Z", { first, repeat, ward });
const ed = item("ed", "ed_note", "2025-06-01T06:00:00Z", "2025-06-01T12:00:00Z", { first, repeat });
const rows = transform([hp, ed], "2025-06-01");
assert.deepEqual(rows.vitals.map(r => [r.local_time, r.systolic_mmhg, r.repeat_systolic_mmhg]), [
  ["2025-06-01T01:10", 150, 130], ["2025-06-01T05:10", 120, undefined],
]);
assert.deepEqual(transform([ed, hp], "2025-06-01"), rows);

// A transfer between ED and inpatient examinations does not make the first
// inpatient pressure an ED repeat just because it was measured a few minutes later.
const closeEd = item("close-ed", "ed_note", "2025-06-01T06:00:00Z", "2025-06-01T10:30:00Z", {
  first: vital("2025-06-01T09:58:00Z", 150, 90),
});
const closeHp = item("close-hp", "hp", "2025-06-01T10:04:00Z", "2025-06-01T11:00:00Z", {
  ward: vital("2025-06-01T10:02:00Z", 120, 75),
});
assert.deepEqual(transform([closeHp, closeEd], "2025-06-01").vitals.map(r => r.systolic_mmhg), [150, 120]);

const lab = (value: string, status = "final") => ({ type: "result", accession: "specimen",
  test: { local_code: "K", name: "Potassium", loinc: "2823-3" }, value, status,
  unit: "mmol/L", collected: "2025-06-01T06:20:00Z", specimen: "serum" });
const labs = [
  item("prelim", "ed_note", "2025-06-01T06:00:00Z", "2025-06-01T09:00:00Z", { lab: lab("6.0", "preliminary") }),
  item("final", "hp", "2025-06-01T10:00:00Z", "2025-06-01T11:00:00Z", { lab: lab("4.0") }),
  item("copy", "progress_note", "2025-06-02T10:00:00Z", "2025-06-02T11:00:00Z", { panel: {
    type: "panel", accession: "specimen", collected: "2025-06-01T06:20:00Z", specimen: "serum", status: "final",
    components: [{ test: lab("4.0").test, value: "4.0", unit: "mmol/L" }],
  } }),
];
const final = transform(labs, "2025-06-02").labs;
assert.equal(final.length, 1);
assert.equal(final[0].value, 4);
assert.deepEqual(final[0].evidence, [{ item_id: "copy", entry_id: "panel" }, { item_id: "final", entry_id: "lab" }]);
assert.equal(final[0].collected, "2025-06-01T06:20:00.000Z");
assert.deepEqual(transform(labs.toReversed(), "2025-06-02").labs, final);
assert.deepEqual(transform(labs, "2025-06-01").labs[0].evidence, [{ item_id: "final", entry_id: "lab" }]);
const corrected = item("corrected", "progress_note", "2025-06-03T10:00:00Z", "2025-06-03T11:00:00Z", { lab: lab("4.5", "corrected") });
const correction = transform([...labs, corrected], "2025-06-03").labs;
assert.equal(correction[0].value, 4.5);
assert.deepEqual(correction[0].evidence, [{ item_id: "corrected", entry_id: "lab" }]);

console.log("Delayed ED signing, transfer examinations, and lab-copy evidence regressions passed");
