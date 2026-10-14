---
folio: "0.1"
id: "01HG99ZV80KDJ9XB7TGNGTCR8K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395951"
effective: "2023-11-27T07:22:00-06:00"
recorded: "2023-11-27T15:12:00-06:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01HG8NATX0SZG2XBMWXCSP5695"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.69",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "result_status": "F",
    "collected": "2023-11-27T07:22:00-06:00",
    "resulted": "2023-11-27T09:00:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-331-92212", "result_code": "LK-CREAT" },
    "order_id": "NO-2023-95625"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "90",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2023-11-27T07:22:00-06:00",
    "resulted": "2023-11-27T09:00:00-06:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-331-92212", "result_code": "LK-EGFR21" },
    "order_id": "NO-2023-95625"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2023-11-27T07:22:00-06:00",
    "resulted": "2023-11-27T15:08:00-06:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to K. Foster RN 09:06. CORRECTED 11/27/23 15:08: result invalidated, see recollected specimen LV23-331-04917.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-331-92212", "result_code": "LK-K" },
    "order_id": "NO-2023-83355"
  },
  "chol": {
    "type": "imported_result",
    "test": { "nfm_code": "CHOL", "name": "Cholesterol, total", "loinc": "2093-3" },
    "value": "200",
    "unit": "mg/dL",
    "reference_range": "100-199",
    "flag": "H",
    "result_status": "F",
    "collected": "2023-11-27T07:22:00-06:00",
    "resulted": "2023-11-27T09:00:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-331-92212", "result_code": "LK-CHOL" },
    "order_id": "NO-2023-64582"
  },
  "trig": {
    "type": "imported_result",
    "test": { "nfm_code": "TRIG", "name": "Triglycerides", "loinc": "2571-8" },
    "value": "178",
    "unit": "mg/dL",
    "reference_range": "0-149",
    "flag": "H",
    "result_status": "F",
    "collected": "2023-11-27T07:22:00-06:00",
    "resulted": "2023-11-27T09:00:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-331-92212", "result_code": "LK-TRIG" },
    "order_id": "NO-2023-64582"
  },
  "hdl": {
    "type": "imported_result",
    "test": { "nfm_code": "HDL", "name": "HDL cholesterol", "loinc": "2085-9" },
    "value": "71",
    "unit": "mg/dL",
    "reference_range": ">39",
    "result_status": "F",
    "collected": "2023-11-27T07:22:00-06:00",
    "resulted": "2023-11-27T09:00:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-331-92212", "result_code": "LK-HDL" },
    "order_id": "NO-2023-64582"
  },
  "ldl": {
    "type": "imported_result",
    "test": { "nfm_code": "LDL-CALC", "name": "LDL cholesterol, calculated", "loinc": "13457-7" },
    "value": "93",
    "unit": "mg/dL",
    "reference_range": "0-99",
    "result_status": "F",
    "collected": "2023-11-27T07:22:00-06:00",
    "resulted": "2023-11-27T09:00:00-06:00",
    "comment": "Calculated (Friedewald).",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-331-92212", "result_code": "LK-LDLC" },
    "order_id": "NO-2023-64582"
  }
}
```
