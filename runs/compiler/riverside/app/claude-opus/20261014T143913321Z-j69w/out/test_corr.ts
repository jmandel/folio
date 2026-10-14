import { readFileSync } from "node:fs";
import { transform } from "./transform.ts";
const g = JSON.parse(readFileSync("in/samples/samples.json", "utf8"));
const items = g[0].items;
const consult = items.find((i: any) => i.id === "01JT1NRCX0R76WG8R1DPZ2JFFW");
const amended = JSON.parse(JSON.stringify(consult));
amended.id = "AMEND1"; amended.recorded = "2025-04-30T15:00:00Z"; amended.supersedes = [consult.id];
amended.payload.med_empagliflozin.status = "stopped";
amended.payload.med_empagliflozin.instructions = "Stopped due to euglycemic DKA";
amended.payload.vs_naive = { type: "vitals", taken: "2025-04-29T08:00:00", bp: { systolic_mmhg: 120, diastolic_mmhg: 70 } };
const retr = { ...consult, id: "RETR", payload: {}, recorded: "2025-05-01T15:00:00Z", supersedes: undefined, retracts: ["01JSZB11F0TPT7DTJ69B3HCPFT"] };
for (const asOf of ["2025-04-30", "2025-05-01"]) {
  const r = transform([...items, amended, retr], asOf);
  console.log(asOf, r.medications.map(m => `${m.ingredient}:${m.status}:${m.status_since}:${m.stop_reason ?? ""}`).join(" | "));
  console.log(r.vitals.slice(-2).map(v => v.local_time + " " + JSON.stringify(v.evidence)).join("\n"));
  console.log(r.labs.length, r.medications[0].evidence.map(e=>e.item_id).join(","));
}
console.log(JSON.stringify(transform([{} as any, null as any, { id: "x", recorded: "bad", payload: null } as any], "2025-01-01")));
