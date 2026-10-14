import { transform } from "./transform.ts";
const r = (id: string, code: string, name: string, value: string, unit: string, rc = "X", loinc?: string) => ({ type: "imported_result", test: { nfm_code: code, name, ...(loinc ? { loinc } : {}) }, value, unit, result_status: "F", collected: "2025-08-22T07:35:00-05:00", resulted: "", external_ref: { lab: "Lakeview Labs", accession: "A" + id, result_code: rc } });
const items: any[] = [{ folio: "0.1", id: "I1", issuer: "x", patient: "p", narrative: "", effective: "2025-08-22T07:35:00-05:00", recorded: "2025-08-22T09:00:00-05:00", payload: {
  a: r("1", "ALBCR", "Albumin-creatinine ratio, urine", "299", "mg/g creat"),
  b: r("2", "HGBA1C", "Hemoglobin A1c", "8.1", "% of total Hgb"),
  c: r("3", "EGFR", "eGFR (CKD-EPI 2021)", "45", "mL/min/{1.73_m2}", "LK-EGFR21"),
  d: r("4", "UCREAT", "Creatinine, urine", "100", "mg/dL"),
  e: r("5", "MALB", "Microalbumin, urine", "30", "mg/L"),
  f: r("6", "UACR2", "Urine albumin/creatinine", "3.4", "mg/mmol"),
} }];
console.log(JSON.stringify(transform(items, "2025-08-22").labs.map(l => [l.analyte, l.value, l.unit])));
