---
folio: "0.1"
id: "01HYGXH8C038J6ZYZ826P8553Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00681589"
effective: "2024-05-22T07:16:00-05:00"
recorded: "2024-05-22T14:48:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01HYGE8BV03QEWRCRT4X52PJG1"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.75",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "result_status": "F",
    "collected": "2024-05-22T07:16:00-05:00",
    "resulted": "2024-05-22T10:10:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-143-57707", "result_code": "LK-CREAT" },
    "order_id": "NO-2024-65370"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": ">90",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2024-05-22T07:16:00-05:00",
    "resulted": "2024-05-22T10:10:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-143-57707", "result_code": "LK-EGFR21" },
    "order_id": "NO-2024-65370"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2024-05-22T07:16:00-05:00",
    "resulted": "2024-05-22T14:44:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to K. Foster RN 10:16. CORRECTED 05/22/24 14:44: result invalidated, see recollected specimen LV24-143-89091.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-143-57707", "result_code": "LK-K" },
    "order_id": "NO-2024-82590"
  },
  "glu": {
    "type": "imported_result",
    "test": { "nfm_code": "GLU", "name": "Glucose, serum", "loinc": "2345-7" },
    "value": "96",
    "unit": "mg/dL",
    "reference_range": "70-99",
    "result_status": "F",
    "collected": "2024-05-22T07:16:00-05:00",
    "resulted": "2024-05-22T10:10:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-143-57707", "result_code": "LK-GLU" },
    "order_id": "NO-2024-69445"
  },
  "chol": {
    "type": "imported_result",
    "test": { "nfm_code": "CHOL", "name": "Cholesterol, total", "loinc": "2093-3" },
    "value": "161",
    "unit": "mg/dL",
    "reference_range": "100-199",
    "result_status": "F",
    "collected": "2024-05-22T07:16:00-05:00",
    "resulted": "2024-05-22T10:10:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-143-57707", "result_code": "LK-CHOL" },
    "order_id": "NO-2024-82649"
  },
  "trig": {
    "type": "imported_result",
    "test": { "nfm_code": "TRIG", "name": "Triglycerides", "loinc": "2571-8" },
    "value": "55",
    "unit": "mg/dL",
    "reference_range": "0-149",
    "result_status": "F",
    "collected": "2024-05-22T07:16:00-05:00",
    "resulted": "2024-05-22T10:10:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-143-57707", "result_code": "LK-TRIG" },
    "order_id": "NO-2024-82649"
  },
  "hdl": {
    "type": "imported_result",
    "test": { "nfm_code": "HDL", "name": "HDL cholesterol", "loinc": "2085-9" },
    "value": "56",
    "unit": "mg/dL",
    "reference_range": ">39",
    "result_status": "F",
    "collected": "2024-05-22T07:16:00-05:00",
    "resulted": "2024-05-22T10:10:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-143-57707", "result_code": "LK-HDL" },
    "order_id": "NO-2024-82649"
  },
  "ldl": {
    "type": "imported_result",
    "test": { "nfm_code": "LDL-CALC", "name": "LDL cholesterol, calculated", "loinc": "13457-7" },
    "value": "94",
    "unit": "mg/dL",
    "reference_range": "0-99",
    "result_status": "F",
    "collected": "2024-05-22T07:16:00-05:00",
    "resulted": "2024-05-22T10:10:00-05:00",
    "comment": "Calculated (Friedewald).",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-143-57707", "result_code": "LK-LDLC" },
    "order_id": "NO-2024-82649"
  }
}
```
