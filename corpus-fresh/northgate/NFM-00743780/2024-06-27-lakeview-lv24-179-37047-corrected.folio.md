---
folio: "0.1"
id: "01J1DHQCD0DM5BJ0PWCH4BC33F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00743780"
effective: "2024-06-27T07:29:00-05:00"
recorded: "2024-06-27T14:11:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01J1D39YS00M9EHTNRF4G40K3B"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.80",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "result_status": "F",
    "collected": "2024-06-27T07:29:00-05:00",
    "resulted": "2024-06-27T09:48:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-179-37047", "result_code": "LK-CREAT" },
    "order_id": "NO-2024-68598"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "81",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2024-06-27T07:29:00-05:00",
    "resulted": "2024-06-27T09:48:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-179-37047", "result_code": "LK-EGFR21" },
    "order_id": "NO-2024-68598"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2024-06-27T07:29:00-05:00",
    "resulted": "2024-06-27T14:07:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 09:54. CORRECTED 06/27/24 14:07: result invalidated, see recollected specimen LV24-179-07096.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-179-37047", "result_code": "LK-K" },
    "order_id": "NO-2024-83119"
  },
  "chol": {
    "type": "imported_result",
    "test": { "nfm_code": "CHOL", "name": "Cholesterol, total", "loinc": "2093-3" },
    "value": "241",
    "unit": "mg/dL",
    "reference_range": "100-199",
    "flag": "H",
    "result_status": "F",
    "collected": "2024-06-27T07:29:00-05:00",
    "resulted": "2024-06-27T09:48:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-179-37047", "result_code": "LK-CHOL" },
    "order_id": "NO-2024-65987"
  },
  "trig": {
    "type": "imported_result",
    "test": { "nfm_code": "TRIG", "name": "Triglycerides", "loinc": "2571-8" },
    "value": "261",
    "unit": "mg/dL",
    "reference_range": "0-149",
    "flag": "H",
    "result_status": "F",
    "collected": "2024-06-27T07:29:00-05:00",
    "resulted": "2024-06-27T09:48:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-179-37047", "result_code": "LK-TRIG" },
    "order_id": "NO-2024-65987"
  },
  "hdl": {
    "type": "imported_result",
    "test": { "nfm_code": "HDL", "name": "HDL cholesterol", "loinc": "2085-9" },
    "value": "41",
    "unit": "mg/dL",
    "reference_range": ">39",
    "result_status": "F",
    "collected": "2024-06-27T07:29:00-05:00",
    "resulted": "2024-06-27T09:48:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-179-37047", "result_code": "LK-HDL" },
    "order_id": "NO-2024-65987"
  },
  "ldl": {
    "type": "imported_result",
    "test": { "nfm_code": "LDL-CALC", "name": "LDL cholesterol, calculated", "loinc": "13457-7" },
    "value": "148",
    "unit": "mg/dL",
    "reference_range": "0-99",
    "flag": "H",
    "result_status": "F",
    "collected": "2024-06-27T07:29:00-05:00",
    "resulted": "2024-06-27T09:48:00-05:00",
    "comment": "Calculated (Friedewald).",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-179-37047", "result_code": "LK-LDLC" },
    "order_id": "NO-2024-65987"
  }
}
```
