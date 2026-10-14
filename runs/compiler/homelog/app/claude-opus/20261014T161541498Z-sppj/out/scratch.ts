import { transform } from "./transform.ts";
const mk = (id: string, recorded: string, payload: any, extra: any = {}) => ({ folio: "0.1", id, issuer: "x", patient: "p", effective: recorded.slice(0,10), recorded, narrative: "", payload, ...extra });
const meds = (o: any) => Object.fromEntries(Object.entries(o).map(([k, v]: any) => [k, { type: "my_med", homelog_med_id: k, kind: "prescription", status: "taking", ...v }]));
const items = [
  mk("A", "2025-01-01T12:00:00Z", meds({ m1: { name: "Zestril", strength_text: "10 mg", how_i_take_it: "morning" } })),
  mk("B", "2025-06-01T12:00:00Z", meds({
    m1: { name: "Lisinopril", strength_text: "20 mg", how_i_take_it: "2 tablets in the morning", started: "June 2019" },
    m2: { name: "Ventolin HFA", strength_text: "90 mcg/puff", how_i_take_it: "2 puffs every 6 hours as needed" },
    m3: { name: "Lantus", strength_text: "100 units/mL", how_i_take_it: "22 units at bedtime" },
    m4: { name: "Amoxicillin", picked_from_search: { rxnorm: "1", display: "amoxicillin 500 MG Oral Capsule" }, status: "stopped", stopped: "2025-05", note: "gave me a rash" },
    m5: { name: "Metoprolol", strength_text: "25 mg", how_i_take_it: "twice a day", note: "doctor said hold until after my knee surgery" },
    m6: { name: "Seroquel", strength_text: "50 mg", how_i_take_it: "at night" },
    m7: { name: "Hyzaar", strength_text: "50-12.5 mg", how_i_take_it: "1 daily" },
    m8: { name: "Famotidine", strength_text: "10 mg", how_i_take_it: "take 2 tablets twice daily" },
    m9: { name: "Prednisone", how_i_take_it: "1 tablet daily" },
    m10: { name: "Amoxicillin suspension", strength_text: "250 mg/5 mL", how_i_take_it: "10 mL three times a day" },
    m11: { name: "Potassium chloride", picked_from_search: { rxnorm: "1", display: "potassium chloride 20 MEQ Extended Release Oral Tablet" }, how_i_take_it: "daily" },
    m12: { name: "Lisinopril", status: "stopped" },
  }), { supersedes: ["A"] }),
  mk("C", "2025-06-02T04:00:00Z", { g: { type: "glucose_reading", measured_at: "2025-06-01T08:00", value: 7.2, unit: "mmol/L", entry_method: "meter_sync" },
    h: { type: "glucose_reading", measured_at: "2025-06-01T09:00", value: 33.3, unit: "mmol/L", out_of_range: "HI", entry_method: "meter_sync" },
    b1: { type: "bp_reading", measured_at: "2025-06-01T08:10", systolic_mmhg: 120, diastolic_mmhg: 80, entry_method: "cuff_sync" },
    b2: { type: "bp_reading", measured_at: "2025-06-01T08:12", systolic_mmhg: 120, diastolic_mmhg: 80, entry_method: "typed" } }),
  mk("D", "2025-06-03T12:00:00Z", {}, { retracts: ["C"] }),
];
for (const a of ["2025-03-01", "2025-06-01", "2025-06-02"]) console.log(a, JSON.stringify(transform(items as any, a), null, 1));
