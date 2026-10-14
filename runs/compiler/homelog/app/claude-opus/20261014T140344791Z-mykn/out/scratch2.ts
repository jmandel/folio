import { transform } from "./transform.ts";
const junk: any[] = [null, 1, {}, { id: "x", recorded: "bad" }, { id: "y", recorded: "2026-01-01T00:00:00Z", payload: { a: null, b: { type: "my_med" }, c: { type: "bp_reading", measured_at: 5 }, d: { type: "glucose_reading", measured_at: "2026-01-01T01:00", value: "7", unit: "mmol/L" } } }];
console.log(JSON.stringify(transform(junk, "2026-10-13")), JSON.stringify(transform(junk, "bad")));
