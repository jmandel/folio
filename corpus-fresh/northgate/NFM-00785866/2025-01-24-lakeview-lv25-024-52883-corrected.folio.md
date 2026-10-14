---
folio: "0.1"
id: "01JJD2QXM06ACYFYHYQHK95EFP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785866"
effective: "2025-01-24T07:48:00-06:00"
recorded: "2025-01-24T15:16:00-06:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01JJCFD0Y0EGS22JY6RVH92GZ5"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.24",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "flag": "H",
    "result_status": "F",
    "collected": "2025-01-24T07:48:00-06:00",
    "resulted": "2025-01-24T09:27:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-024-52883", "result_code": "LK-CREAT" },
    "order_id": "NO-2025-67294"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "47",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "flag": "L",
    "result_status": "F",
    "collected": "2025-01-24T07:48:00-06:00",
    "resulted": "2025-01-24T09:27:00-06:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-024-52883", "result_code": "LK-EGFR21" },
    "order_id": "NO-2025-67294"
  },
  "na": {
    "type": "imported_result",
    "test": { "nfm_code": "NA", "name": "Sodium, serum", "loinc": "2951-2" },
    "value": "143",
    "unit": "mmol/L",
    "reference_range": "134-144",
    "result_status": "F",
    "collected": "2025-01-24T07:48:00-06:00",
    "resulted": "2025-01-24T09:27:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-024-52883", "result_code": "LK-NA" },
    "order_id": "NO-2025-63677"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2025-01-24T07:48:00-06:00",
    "resulted": "2025-01-24T15:12:00-06:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 09:33. CORRECTED 01/24/25 15:12: result invalidated, see recollected specimen LV25-024-38034.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-024-52883", "result_code": "LK-K" },
    "order_id": "NO-2025-99163"
  },
  "chol": {
    "type": "imported_result",
    "test": { "nfm_code": "CHOL", "name": "Cholesterol, total", "loinc": "2093-3" },
    "value": "195",
    "unit": "mg/dL",
    "reference_range": "100-199",
    "result_status": "F",
    "collected": "2025-01-24T07:48:00-06:00",
    "resulted": "2025-01-24T09:27:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-024-52883", "result_code": "LK-CHOL" },
    "order_id": "NO-2025-70578"
  },
  "trig": {
    "type": "imported_result",
    "test": { "nfm_code": "TRIG", "name": "Triglycerides", "loinc": "2571-8" },
    "value": "120",
    "unit": "mg/dL",
    "reference_range": "0-149",
    "result_status": "F",
    "collected": "2025-01-24T07:48:00-06:00",
    "resulted": "2025-01-24T09:27:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-024-52883", "result_code": "LK-TRIG" },
    "order_id": "NO-2025-70578"
  },
  "hdl": {
    "type": "imported_result",
    "test": { "nfm_code": "HDL", "name": "HDL cholesterol", "loinc": "2085-9" },
    "value": "58",
    "unit": "mg/dL",
    "reference_range": ">39",
    "result_status": "F",
    "collected": "2025-01-24T07:48:00-06:00",
    "resulted": "2025-01-24T09:27:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-024-52883", "result_code": "LK-HDL" },
    "order_id": "NO-2025-70578"
  },
  "ldl": {
    "type": "imported_result",
    "test": { "nfm_code": "LDL-CALC", "name": "LDL cholesterol, calculated", "loinc": "13457-7" },
    "value": "113",
    "unit": "mg/dL",
    "reference_range": "0-99",
    "flag": "H",
    "result_status": "F",
    "collected": "2025-01-24T07:48:00-06:00",
    "resulted": "2025-01-24T09:27:00-06:00",
    "comment": "Calculated (Friedewald).",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-024-52883", "result_code": "LK-LDLC" },
    "order_id": "NO-2025-70578"
  }
}
```
