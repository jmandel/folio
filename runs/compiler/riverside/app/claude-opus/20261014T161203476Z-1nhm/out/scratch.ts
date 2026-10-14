import { readFileSync } from "node:fs";
import { transform } from "./transform.ts";
const g = JSON.parse(readFileSync(new URL("../in/samples/samples.json", import.meta.url), "utf8"))[0];
for (const asOf of ["2023-04-08", "2023-04-09", "2023-04-12", "2025-04-28", "2025-04-29"]) {
  const r = transform(g.items, asOf);
  console.log(asOf, r.medications.map((m) => `${m.ingredient}:${m.status}:${m.status_since ?? ""}:${m.status_reason_text ?? ""}`).join(" | "));
  console.log("   P", r.problems.map((p) => `${p.condition}:${p.status}`).join(" | "), " A", r.allergies.map((a) => a.substance).join(","), " L", r.labs.length, " V", r.vitals.length);
}
// robustness
console.log(JSON.stringify(transform([null, {}, { id: "x", recorded: "bad", payload: 3 }, { id: "y", recorded: "2020-01-01T00:00:00Z", payload: { a: { type: "panel", components: [null, 1] }, b: { type: "home_med" }, c: { type: "vitals", taken: "2020" } } }] as any, "2024-01-01")));
// supersede / retract
const items = JSON.parse(JSON.stringify(g.items));
const consult = items.find((i: any) => i.id === "01JT1NRCX0R76WG8R1DPZ2JFFW");
items.push({ ...consult, id: "R1", recorded: "2025-04-30T01:00:00Z", retracts: ["01JT1NRCX0R76WG8R1DPZ2JFFW"], payload: {} });
const r = transform(items, "2025-04-30");
console.log("after retract", r.medications.map((m) => `${m.ingredient}:${m.status}:${m.status_reason_text ?? ""}`).join(" | "));
