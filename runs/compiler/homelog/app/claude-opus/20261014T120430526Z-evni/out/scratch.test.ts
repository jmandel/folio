import { transform } from "./transform.ts";

const base = { folio: "0.1", issuer: "did:web:homelog.example", patient: "P", narrative: "" };
const items: any[] = [
  { ...base, id: "D1", effective: "2025-03-01", recorded: "2025-03-02T05:00:00Z", payload: {
    bp_1: { type: "bp_reading", measured_at: "2025-03-01T08:00", systolic_mmhg: 150, diastolic_mmhg: 90, pulse_bpm: 70, entry_method: "cuff_sync" },
    bp_2: { type: "bp_reading", measured_at: "2025-03-01T08:02", systolic_mmhg: 150, diastolic_mmhg: 90, entry_method: "typed" },
    glu_1: { type: "glucose_reading", measured_at: "2025-03-01T09:00", value: 33.3, unit: "mmol/L", out_of_range: "HI", entry_method: "meter_sync" },
  } },
  { ...base, id: "D2", effective: "2025-03-01", recorded: "2025-03-05T05:00:00Z", supersedes: ["D1"], payload: {
    bp_1: { type: "bp_reading", measured_at: "2025-03-01T08:00", systolic_mmhg: 151, diastolic_mmhg: 90, entry_method: "typed" },
  } },
  { ...base, id: "L1", effective: "2025-03-01", recorded: "2025-03-01T12:00:00Z", narrative: "My Medicines, saved", payload: {
    a: { type: "my_med", homelog_med_id: "a", name: "water pill", status: "stopped", note: "paused until after surgery", stopped: "2025-02", kind: "prescription" },
    b: { type: "my_med", homelog_med_id: "b", name: "Lisinipril", status: "stopped", stopped: "2024", kind: "prescription", note: "switched to losartan" },
    c: { type: "my_med", homelog_med_id: "c", name: "lisinopril 10mg", status: "taking", started: "2025-01", how_i_take_it: "1 tablet twice a day", kind: "prescription" },
  } },
  { ...base, id: "L0", effective: "2025-02-01", recorded: "2025-02-01T12:00:00Z", payload: { z: { type: "my_med", name: "x", status: "taking" } } },
  { garbage: true }, null,
];
for (const asOf of ["2025-03-01", "2025-03-04", "2025-03-05", "2025-03-04x"]) {
  console.log(asOf, JSON.stringify(transform(items, asOf), null, 1));
}
