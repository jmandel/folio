import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "did:web:northgate-fm.example", patient: "P1", narrative: "" };
let n = 0;
const it = (eff: string, rec: string, payload: any, extra: any = {}) => ({ ...base, id: `I${++n}`, effective: eff, recorded: rec, payload, ...extra });
const med = (id: string, action: string, name: string, x: any = {}) => ({ m: { type: "med_event", med_id: id, action, origin: "northgate", drug: { name }, ...x } });
const lab = (code: string, name: string, value: string, unit: string, rc: string, st = "F", x: any = {}) => ({ type: "imported_result", test: { nfm_code: code, name }, value, unit, result_status: st, collected: "2021-03-01T08:00:00-06:00", resulted: "x", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: rc }, ...x });
const items = [
  it("2020-01-05T10:00:00-06:00", "2020-01-05T10:01:00-06:00", med("ML-1", "start", "losartan potassium 50 MG Oral Tablet", { rxnorm: "979492", dose: { value: 1, unit: "tab" } })),
  it("2021-02-05T10:00:00-06:00", "2021-02-05T10:01:00-06:00", med("ML-1", "hold", "losartan potassium 50 MG Oral Tablet", { reason_text: "AKI", review_on: "2021-03-01" })),
  it("2020-01-05T10:00:00-06:00", "2020-01-05T10:01:00-06:00", med("ML-2", "start", "Jardiance 10mg", { origin: "outside", outside_code: { system: "lakeview-drug", code: "X" } })),
  it("2022-01-05T10:00:00-06:00", "2022-01-05T10:01:00-06:00", med("ML-3", "start", "empagliflozin 25 MG Oral Tablet", { rxnorm: "1545664" })),
  it("2023-01-05T10:00:00-06:00", "2023-01-05T10:01:00-06:00", med("ML-4", "start", "carvedilol 12.5 MG Oral Tablet")),
  it("2023-01-06T10:00:00-06:00", "2023-01-06T10:00:00-06:00", { v: { type: "chart_correction", voided_items: ["I5"], reason: "entry_error" } }, { retracts: ["I5"] }),
  it("2026-10-13T23:30:00-05:00", "2026-10-13T23:30:00-05:00", med("ML-5", "start", "metformin HCl 500 MG")),
  it("2026-10-14T00:30:00-05:00", "2026-10-14T00:30:00-05:00", med("ML-6", "start", "atorvastatin 40 MG")),
  it("2021-03-01T08:00:00-06:00", "2021-03-01T12:00:00-06:00", {
    a: lab("EGFR-NAA", "eGFR non-African American", "55", "mL/min/1.73m2", "LK-EGFR09N"),
    b: lab("EGFR-AA", "eGFR African American", "64", "mL/min/1.73m2", "LK-EGFR09A"),
    c: lab("PLT", "Platelets", "212000", "cells/uL", "LK-PLT", "P"),
    d: lab("GFR", "eGFR", ">60", "mL/min/1.73m2", "LK-EGFRX", "F", { comment: "MDRD" }),
  }),
  it("2021-03-01T08:00:00-06:00", "2021-03-01T13:00:00-06:00", { c: lab("PLT", "Platelets", "215000", "cells/uL", "LK-PLT", "F") }),
];
console.log(JSON.stringify(transform(items as any, "2026-10-13"), (k, v) => (k === "meta" || k === "category" || k === "subject" ? undefined : v), 1));
