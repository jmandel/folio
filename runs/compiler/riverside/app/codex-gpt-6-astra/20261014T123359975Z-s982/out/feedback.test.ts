import { expect, test } from "bun:test";
import type { FolioItem } from "../in/views/views";
import { transform } from "./transform";

// Extract the actual structured records, retaining their original timestamps.
// The checker's inferred dates are not authoritative source fields.
const feedback = await Bun.file(new URL("../in/feedback.md", import.meta.url)).text();
const fixtures = [...feedback.matchAll(/````markdown\n([\s\S]*?)\n````/g)].map(match => {
  const markdown = match[1];
  const envelope = markdown.split("\n---\n")[0];
  const fields = Object.fromEntries([...envelope.matchAll(/^(folio|id|issuer|patient|effective|recorded): "([^"]*)"$/gm)]
    .map(m => [m[1], m[2]]));
  const payload = JSON.parse(/```json payload\n([\s\S]*?)\n```/.exec(markdown)![1]);
  return { ...fields, payload, narrative: markdown.split("\n---\n")[1].split("```json payload")[0] } as FolioItem;
});
function fixture(id: string): FolioItem {
  const found = fixtures.find(i => i.id === id);
  if (!found) throw new Error(`Missing feedback fixture ${id}`);
  return structuredClone(found);
}
const renal = "01J1C2ZDA0TYTTM11347HN7791";
const chest2022 = "01FZ2K8620E9Y9KMN60SG8ATRM";
const chest2024 = "01HV8SH3Q0KD0QRJY98X7FQ8EM";
const dka = "01JB3N7W30VBSTD9ZSNC3Y51J7";

for (const [id, asOf, local_time, systolic_mmhg, diastolic_mmhg] of [
  [renal, "2024-06-27", "2024-06-26T20:54", 135, 81],
  [chest2022, "2022-03-26", "2022-03-25T22:18", 145, 87],
  [chest2024, "2024-04-12", "2024-04-11T23:54", 152, 91],
  [dka, "2024-10-26", "2024-10-25T20:11", 116, 70],
] as const) test(`feedback BP ${id} stays on its actual Chicago day`, () => {
  expect(transform([fixture(id)], asOf).vitals).toMatchObject([{
    local_time, systolic_mmhg, diastolic_mmhg,
    evidence: [{ item_id: id, entry_id: "vs_1" }],
  }]);
});

for (const [id, asOf, entry_id, collected] of [
  [chest2022, "2022-03-26", "trop_2", "2022-03-26T06:39:00Z"],
  [chest2024, "2024-04-12", "trop_1", "2024-04-12T05:16:00Z"],
  [chest2024, "2024-04-12", "trop_2", "2024-04-12T08:16:00Z"],
] as const) test(`feedback troponin ${id}/${entry_id} retains its comparator and instant`, () => {
  const troponins = transform([fixture(id)], asOf).labs.filter(l => l.analyte === "troponin");
  expect(troponins).toHaveLength(2);
  expect(troponins.find(l => l.evidence.some(e => e.entry_id === entry_id))).toMatchObject({
    value: .01, comparator: "<", unit: "ng/mL", collected,
    evidence: [{ item_id: id, entry_id }],
  });
});

for (const [analyte, value] of [
  ["potassium", 5], ["chloride", 92], ["bicarbonate", 13], ["anion_gap", 27],
  ["bun", 35], ["creatinine", .93], ["egfr", 63],
] as const) test(`feedback arrival ${analyte} is still a valid result`, () => {
  expect(transform([fixture(dka)], "2024-10-26").labs.find(l => l.analyte === analyte)).toMatchObject({
    value, collected: "2024-10-26T01:23:00Z", evidence: [{ item_id: dka, entry_id: "bmp" }],
  });
});

test("later hospital sets and new specimens do not replace ED measurements", () => {
  const ed = fixture(dka);
  const repeatValues: Record<string, string> = {
    K: "3.9", CL: "104", CO2: "19", AGAP: "9", BUN: "22", CREAT: "0.83", EGFR: "72",
  };
  const later: FolioItem = {
    ...ed, id: "later", recorded: "2024-10-26T15:00:00Z", payload: {
      enc: { ...ed.payload.enc, document_kind: "progress_note", class: "inpatient" },
      bmp: { ...ed.payload.bmp, accession: "independent-repeat", collected: "2024-10-26T11:09:00Z",
        components: ed.payload.bmp.components.map((c: any) => ({ ...c, value: repeatValues[c.test.local_code] ?? c.value })),
      },
      vs_1: { ...ed.payload.vs_1, taken: "2024-10-26T12:16:00Z", bp: { systolic_mmhg: 126, diastolic_mmhg: 76 } },
    },
  };
  const rows = transform([later, ed], "2024-10-26");
  for (const [analyte, values] of [
    ["potassium", [5, 3.9]], ["chloride", [92, 104]], ["bicarbonate", [13, 19]],
    ["anion_gap", [27, 9]], ["bun", [35, 22]], ["creatinine", [.93, .83]], ["egfr", [63, 72]],
  ] as const) expect(rows.labs.filter(l => l.analyte === analyte).map(l => l.value)).toEqual(values);
  expect(rows.vitals.map(v => [v.local_time, v.systolic_mmhg, v.diastolic_mmhg])).toEqual([
    ["2024-10-25T20:11", 116, 70], ["2024-10-26T07:16", 126, 76],
  ]);
  expect(transform([ed, later], "2024-10-26")).toEqual(rows);
});

test("copies deduplicate by accession and code, including renamed payload keys", () => {
  const ed = fixture(dka);
  const copy: FolioItem = {
    ...ed, id: "copy", recorded: "2024-10-26T15:00:00Z", payload: {
      enc: ed.payload.enc, renamedPanel: ed.payload.bmp, renamedVitals: ed.payload.vs_1,
    },
  };
  const rows = transform([copy, ed], "2024-10-26");
  expect(rows.labs.filter(l => l.analyte === "potassium")).toHaveLength(1);
  expect(rows.vitals).toHaveLength(1);
  expect(rows.labs.find(l => l.analyte === "potassium")?.evidence).toEqual([{ item_id: "copy", entry_id: "renamedPanel" }]);
});

test("recorded determines visibility; earlier measurement dates remain visible after signing", () => {
  for (const source of fixtures) {
    const day = source.recorded.slice(0, 10);
    const previous = new Date(Date.parse(`${day}T12:00:00Z`) - 86400000).toISOString().slice(0, 10);
    expect(transform([source], previous)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
    const rows = transform([source], day);
    expect(rows.labs.length).toBeGreaterThan(0);
    expect(rows.vitals).toHaveLength(1);
    expect(transform([source], "2026-10-14")).toEqual(rows);
    expect(transform([{ ...source, narrative: "" }], day)).toEqual(rows);
  }
});

test("a future replacement does not hide an in-scope ED record; a current one does", () => {
  const ed = fixture(dka);
  const replacement: FolioItem = {
    ...ed, id: "replacement", recorded: "2024-10-27T05:00:00Z", supersedes: [ed.id], payload: {},
  };
  expect(transform([replacement, ed], "2024-10-26")).toEqual(transform([ed], "2024-10-26"));
  expect(transform([replacement, ed], "2024-10-27")).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});
