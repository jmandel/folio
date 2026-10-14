import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "did:web:homelog.example", patient: "P1", narrative: "My Medicines" };
const meds = (o: any[]) => Object.fromEntries(o.map((m, i) => [`med_${i + 1}`, { type: "my_med", homelog_med_id: `med_${i + 1}`, kind: "prescription", ...m }]));
const A = { ...base, id: "A", effective: "2026-03-08", recorded: "2026-03-08T05:30:00Z", payload: meds([{ name: "Lantus", strength_text: "100 units/mL pen", how_i_take_it: "22 units at bedtime", status: "taking", started: "2019" }]) };
const B = { ...base, id: "B", effective: "2026-03-09", recorded: "2026-03-10T04:59:00Z", supersedes: ["A"], payload: meds([
  { name: "Lantus", strength_text: "100 units/mL pen", how_i_take_it: "22 units at bedtime", status: "taking", started: "2019" },
  { name: "Zestril", status: "stopped", stopped: "2025-06", started: "2020", note: "Dry cough, doctor switched me to losartan", how_i_take_it: "1 in the morning", strength_text: "10 mg" },
  { name: "losartan", status: "taking", started: "2025-06", how_i_take_it: "2 tablets daily", strength_text: "25 mg" },
  { name: "Jardiance", status: "taking", note: "Dr said stop for now until after my surgery", how_i_take_it: "morning", picked_from_search: { rxnorm: "1545653", display: "empagliflozin" } },
  { name: "water pill", status: "taking", how_i_take_it: "every other day" },
  { name: "Metformin", status: "stopped", stopped: "2025", note: "upset my stomach", how_i_take_it: "500mg twice a day" },
  { name: "Metformin ER", status: "taking", started: "2025-02", how_i_take_it: "2 with supper", strength_text: "500 mg" },
  { name: "Albuterol inhaler", status: "taking", how_i_take_it: "2 puffs as needed", kind: "prescription" },
  { name: "Vitamin D", status: "taking", how_i_take_it: "daily", kind: "over_the_counter", strength_text: "1000 IU" },
]) };
const R = { ...base, id: "C", effective: "2026-03-11", recorded: "2026-03-11T12:00:00Z", supersedes: [], retracts: ["B"], payload: {} };
for (const asOf of ["2026-03-07", "2026-03-09", "2026-03-10", "2026-03-11"]) {
  const r = transform([R, B, A] as any, asOf);
  console.log(asOf, r.medicationRequests.length);
  if (asOf === "2026-03-10") for (const m of r.medicationRequests) console.log(m.status, m.medicationCodeableConcept.text, JSON.stringify(m.medicationCodeableConcept.coding?.[0] ?? ""), m.authoredOn, JSON.stringify(m.statusReason ?? ""), JSON.stringify(m.dosageInstruction?.[0]));
}
console.log(JSON.stringify(transform(null as any, "x")), JSON.stringify(transform([{ junk: 1 }] as any, "2026-01-01")));
