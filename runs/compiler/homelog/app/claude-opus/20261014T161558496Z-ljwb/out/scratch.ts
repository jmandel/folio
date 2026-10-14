import { transform } from "./transform.ts";
const mk = (id: string, recorded: string, payload: any, extra: any = {}) => ({ folio: "0.1", id, issuer: "x", patient: "p", effective: recorded.slice(0,10), recorded, narrative: "", payload, ...extra });
const items = [
  mk("A", "2025-03-01T12:00:00Z", { m1: { type: "my_med", homelog_med_id: "m1", name: "Lantus", strength_text: "100 units/mL", how_i_take_it: "18 units at bedtime", status: "taking", kind: "prescription", started: "2023-05" },
    m2: { type: "my_med", homelog_med_id: "m2", name: "Seroquel", strength_text: "50 mg", how_i_take_it: "2 tablets at night", status: "taking", kind: "prescription", note: "paused until after my surgery" },
    m3: { type: "my_med", homelog_med_id: "m3", name: "Amoxicillin", strength_text: "500 mg", how_i_take_it: "three times a day", status: "stopped", stopped: "2025-02-20", kind: "prescription", note: "gave me a rash" },
    m4: { type: "my_med", homelog_med_id: "m4", name: "Pepcid", strength_text: "10 mg", how_i_take_it: "take 2 tablets twice a day", status: "taking", kind: "over_the_counter" },
    m5: { type: "my_med", homelog_med_id: "m5", name: "Humalog", how_i_take_it: "sliding scale with meals", status: "taking", kind: "prescription" },
  }),
  mk("B", "2025-03-02T05:30:00Z", { g1: { type: "glucose_reading", measured_at: "2025-03-01T22:10", value: 7.2, unit: "mmol/L", entry_method: "meter_sync" },
    g2: { type: "glucose_reading", measured_at: "2025-03-01T22:11", value: 7.2, unit: "mmol/L", entry_method: "typed" },
    g3: { type: "glucose_reading", measured_at: "2025-03-01T23:00", value: 600, unit: "mg/dL", out_of_range: "HI", entry_method: "meter_sync" },
    b1: { type: "bp_reading", measured_at: "2025-03-01T08:00-06:00", systolic_mmhg: 150, diastolic_mmhg: 90, entry_method: "typed" } }),
  mk("C", "2025-03-02T06:30:00Z", {}, { retracts: ["B"] }),
];
for (const d of ["2025-03-01", "2025-03-02"]) console.log(d, JSON.stringify(transform(items as any, d), null, 1));
