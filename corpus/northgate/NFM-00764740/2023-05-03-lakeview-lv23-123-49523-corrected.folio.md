---
folio: "0.1"
id: "01GZHNQ2M0E2SCGB16YHGYB5JQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00764740"
effective: "2023-05-03T07:42:00-05:00"
recorded: "2023-05-03T15:44:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01GZH30AF067DHC2E2YW37390K"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.95",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "result_status": "F",
    "collected": "2023-05-03T07:42:00-05:00",
    "resulted": "2023-05-03T10:06:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-123-49523", "result_code": "LK-CREAT" },
    "order_id": "NO-2023-97188"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "62",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2023-05-03T07:42:00-05:00",
    "resulted": "2023-05-03T10:06:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-123-49523", "result_code": "LK-EGFR21" },
    "order_id": "NO-2023-97188"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2023-05-03T07:42:00-05:00",
    "resulted": "2023-05-03T15:40:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to K. Foster RN 10:12. CORRECTED 05/03/23 15:40: result invalidated, see recollected specimen LV23-123-08757.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-123-49523", "result_code": "LK-K" },
    "order_id": "NO-2023-77815"
  },
  "glu": {
    "type": "imported_result",
    "test": { "nfm_code": "GLU", "name": "Glucose, serum", "loinc": "2345-7" },
    "value": "84",
    "unit": "mg/dL",
    "reference_range": "70-99",
    "result_status": "F",
    "collected": "2023-05-03T07:42:00-05:00",
    "resulted": "2023-05-03T10:06:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-123-49523", "result_code": "LK-GLU" },
    "order_id": "NO-2023-66185"
  },
  "chol": {
    "type": "imported_result",
    "test": { "nfm_code": "CHOL", "name": "Cholesterol, total", "loinc": "2093-3" },
    "value": "188",
    "unit": "mg/dL",
    "reference_range": "100-199",
    "result_status": "F",
    "collected": "2023-05-03T07:42:00-05:00",
    "resulted": "2023-05-03T10:06:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-123-49523", "result_code": "LK-CHOL" },
    "order_id": "NO-2023-82677"
  },
  "trig": {
    "type": "imported_result",
    "test": { "nfm_code": "TRIG", "name": "Triglycerides", "loinc": "2571-8" },
    "value": "134",
    "unit": "mg/dL",
    "reference_range": "0-149",
    "result_status": "F",
    "collected": "2023-05-03T07:42:00-05:00",
    "resulted": "2023-05-03T10:06:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-123-49523", "result_code": "LK-TRIG" },
    "order_id": "NO-2023-82677"
  },
  "hdl": {
    "type": "imported_result",
    "test": { "nfm_code": "HDL", "name": "HDL cholesterol", "loinc": "2085-9" },
    "value": "42",
    "unit": "mg/dL",
    "reference_range": ">39",
    "result_status": "F",
    "collected": "2023-05-03T07:42:00-05:00",
    "resulted": "2023-05-03T10:06:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-123-49523", "result_code": "LK-HDL" },
    "order_id": "NO-2023-82677"
  },
  "ldl": {
    "type": "imported_result",
    "test": { "nfm_code": "LDL-CALC", "name": "LDL cholesterol, calculated", "loinc": "13457-7" },
    "value": "119",
    "unit": "mg/dL",
    "reference_range": "0-99",
    "flag": "H",
    "result_status": "F",
    "collected": "2023-05-03T07:42:00-05:00",
    "resulted": "2023-05-03T10:06:00-05:00",
    "comment": "Calculated (Friedewald).",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-123-49523", "result_code": "LK-LDLC" },
    "order_id": "NO-2023-82677"
  }
}
```
