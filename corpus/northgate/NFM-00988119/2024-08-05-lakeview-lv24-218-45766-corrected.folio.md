---
folio: "0.1"
id: "01J4J1JFR074ATX5QY9FN6F25M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00988119"
effective: "2024-08-05T07:41:00-05:00"
recorded: "2024-08-05T14:52:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01J4HGMG00F2AY37Y4BVPZ7FKW"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.97",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "result_status": "F",
    "collected": "2024-08-05T07:41:00-05:00",
    "resulted": "2024-08-05T09:45:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-218-45766", "result_code": "LK-CREAT" },
    "order_id": "NO-2024-70810"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "89",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2024-08-05T07:41:00-05:00",
    "resulted": "2024-08-05T09:45:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-218-45766", "result_code": "LK-EGFR21" },
    "order_id": "NO-2024-70810"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2024-08-05T07:41:00-05:00",
    "resulted": "2024-08-05T14:48:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. CORRECTED 08/05/24 14:48: result invalidated, see recollected specimen LV24-218-88430.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-218-45766", "result_code": "LK-K" },
    "order_id": "NO-2024-58046"
  },
  "chol": {
    "type": "imported_result",
    "test": { "nfm_code": "CHOL", "name": "Cholesterol, total", "loinc": "2093-3" },
    "value": "229",
    "unit": "mg/dL",
    "reference_range": "100-199",
    "flag": "H",
    "result_status": "F",
    "collected": "2024-08-05T07:41:00-05:00",
    "resulted": "2024-08-05T09:45:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-218-45766", "result_code": "LK-CHOL" },
    "order_id": "NO-2024-78249"
  },
  "trig": {
    "type": "imported_result",
    "test": { "nfm_code": "TRIG", "name": "Triglycerides", "loinc": "2571-8" },
    "value": "166",
    "unit": "mg/dL",
    "reference_range": "0-149",
    "flag": "H",
    "result_status": "F",
    "collected": "2024-08-05T07:41:00-05:00",
    "resulted": "2024-08-05T09:45:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-218-45766", "result_code": "LK-TRIG" },
    "order_id": "NO-2024-78249"
  },
  "hdl": {
    "type": "imported_result",
    "test": { "nfm_code": "HDL", "name": "HDL cholesterol", "loinc": "2085-9" },
    "value": "47",
    "unit": "mg/dL",
    "reference_range": ">39",
    "result_status": "F",
    "collected": "2024-08-05T07:41:00-05:00",
    "resulted": "2024-08-05T09:45:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-218-45766", "result_code": "LK-HDL" },
    "order_id": "NO-2024-78249"
  },
  "ldl": {
    "type": "imported_result",
    "test": { "nfm_code": "LDL-CALC", "name": "LDL cholesterol, calculated", "loinc": "13457-7" },
    "value": "149",
    "unit": "mg/dL",
    "reference_range": "0-99",
    "flag": "H",
    "result_status": "F",
    "collected": "2024-08-05T07:41:00-05:00",
    "resulted": "2024-08-05T09:45:00-05:00",
    "comment": "Calculated (Friedewald).",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-218-45766", "result_code": "LK-LDLC" },
    "order_id": "NO-2024-78249"
  }
}
```
