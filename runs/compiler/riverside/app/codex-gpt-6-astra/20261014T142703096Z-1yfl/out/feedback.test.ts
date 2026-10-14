import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import type { FolioItem } from "../in/views/views";
import { transform } from "./transform";

// Replay every assertion using only the actual structured items supplied in
// feedback.md. The rest of those patients' charts was not supplied.
const feedback = readFileSync(new URL("../in/feedback.md", import.meta.url), "utf8");
const cases = [...feedback.matchAll(/^## Patient (\S+), as of (\d{4}-\d{2}-\d{2}):[^\n]*\n([\s\S]*?)(?=^## Patient |$(?![\s\S]))/gm)];
const patients = new Map<string, FolioItem[]>();
for (const [, patient, , body] of cases) {
  const md = /````markdown\n---\n([\s\S]*?)\n---\n([\s\S]*?)```json payload\n([\s\S]*?)\n```/.exec(body);
  if (!md) continue;
  const item = { ...Bun.YAML.parse(md[1]), narrative: md[2], payload: JSON.parse(md[3]) } as FolioItem;
  const items = patients.get(patient) ?? [];
  items.push(item);
  patients.set(patient, items);
}
assert.equal(patients.size, 3);
assert.equal([...patients.values()].flat().length, 4);
assert.equal(cases.length, 24);

for (const [, patient, asOf, body] of cases) {
  const assertion = JSON.parse(/- Narrative says[^\n]*: (\{[^\n]*\})/.exec(body)![1]);
  const items = patients.get(patient)!;
  const rows = transform(items, asOf);
  assert.deepEqual(transform(items.toReversed(), asOf), rows);
  if (assertion.view === "labs") {
    assert(rows.labs.some(row => row.analyte === assertion.analyte && row.value === assertion.value),
      `${patient}: missing ${assertion.analyte} ${assertion.value}`);
  } else {
    assert(rows.vitals.some(row => row.systolic_mmhg === assertion.systolic_mmhg && row.diastolic_mmhg === assertion.diastolic_mmhg),
      `${patient}: missing BP ${assertion.systolic_mmhg}/${assertion.diastolic_mmhg}`);
  }
}

const chestPain = patients.get("RRH-00571362")!;
const chestRows = transform(chestPain, "2024-04-12");
assert.equal(chestRows.vitals[0].local_time, "2024-04-11T23:54");
assert.equal(chestRows.vitals[0].systolic_mmhg, 152);
assert.equal(transform(chestPain, "2024-04-11").vitals.length, 0); // Not recorded yet.
assert.equal(chestRows.labs.filter(row => row.analyte === "troponin").length, 2);
assert(chestRows.labs.filter(row => row.analyte === "troponin").every(row => row.comparator === "<"));

const dka = patients.get("RRH-00941538")!;
const dkaRows = transform(dka, "2025-09-23");
assert.equal(dkaRows.vitals[0].local_time, "2025-09-22T23:47");
assert.equal(dkaRows.vitals[0].systolic_mmhg, 111);

const pneumonia = patients.get("RRH-00903997")!;
const pneumoniaRows = transform(pneumonia, "2025-03-15");
assert.deepEqual(pneumoniaRows.vitals.map(row => [row.local_time, row.systolic_mmhg]), [
  ["2025-03-14T22:18", 123], ["2025-03-15T02:02", 114],
]);
assert.equal(pneumoniaRows.labs.length, 12); // Nine BMP components, three CBC components.
assert(pneumoniaRows.labs.every(row => row.collected === "2025-03-15T03:42:00.000Z"));
assert.equal(pneumoniaRows.labs.find(row => row.analyte === "sodium")!.value, 133);
assert.equal(pneumoniaRows.labs.find(row => row.analyte === "wbc")!.value, 16.7);
assert.equal(transform(pneumonia, "2025-03-14").labs.length, 0); // Both notes signed the next local day.

// A newer examination in the same stay must not hide the previous evening's BP.
const laterDka: FolioItem = {
  ...dka[0], id: "later-dka-hp", effective: "2025-09-23T10:30:00Z", recorded: "2025-09-23T12:00:00Z",
  payload: {
    enc: { ...dka[0].payload.enc, document_kind: "hp", class: "inpatient" },
    vs: { type: "vitals", taken: "2025-09-23T10:27:00Z", bp: { systolic_mmhg: 112, diastolic_mmhg: 67 } },
  },
};
assert.deepEqual(transform([...dka, laterDka], "2025-09-23").vitals.map(row => [row.local_time, row.systolic_mmhg]), [
  ["2025-09-22T23:47", 111], ["2025-09-23T05:27", 112],
]);

// Still obey correction rules when an older measurement is copied in a newer note.
const ed = pneumonia.find(item => item.payload.enc.document_kind === "ed_note")!;
const hp = pneumonia.find(item => item.payload.enc.document_kind === "hp")!;
const withdrawal: FolioItem = { ...hp, id: "withdrawal", recorded: "2025-03-16T12:00:00Z", payload: {}, retracts: [ed.id] };
assert.equal(transform([...pneumonia, withdrawal], "2025-03-15").labs.length, 12);
assert.equal(transform([...pneumonia, withdrawal], "2025-03-16").labs.length, 9);

console.log("24 feedback assertions and Chicago-date, copy, cutoff, and correction regressions passed");
