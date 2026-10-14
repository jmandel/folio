---
folio: "0.1"
id: "01HK5ZS7X05G8M0M9YKW0BP9BS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00869685"
effective: "2024-01-02T07:52:00-06:00"
recorded: "2024-01-02T15:03:00-06:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01HK5GNV503PBWJ9D2PS7JMN4K"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.78",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "result_status": "F",
    "collected": "2024-01-02T07:52:00-06:00",
    "resulted": "2024-01-02T10:28:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-002-41281", "result_code": "LK-CREAT" },
    "order_id": "NO-2024-97661"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": ">90",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2024-01-02T07:52:00-06:00",
    "resulted": "2024-01-02T10:28:00-06:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-002-41281", "result_code": "LK-EGFR21" },
    "order_id": "NO-2024-97661"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2024-01-02T07:52:00-06:00",
    "resulted": "2024-01-02T14:59:00-06:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 10:34. CORRECTED 01/02/24 14:59: result invalidated, see recollected specimen LV24-002-19055.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-002-41281", "result_code": "LK-K" },
    "order_id": "NO-2024-71997"
  },
  "glu": {
    "type": "imported_result",
    "test": { "nfm_code": "GLU", "name": "Glucose, serum", "loinc": "2345-7" },
    "value": "87",
    "unit": "mg/dL",
    "reference_range": "70-99",
    "result_status": "F",
    "collected": "2024-01-02T07:52:00-06:00",
    "resulted": "2024-01-02T10:28:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-002-41281", "result_code": "LK-GLU" },
    "order_id": "NO-2024-78221"
  },
  "chol": {
    "type": "imported_result",
    "test": { "nfm_code": "CHOL", "name": "Cholesterol, total", "loinc": "2093-3" },
    "value": "194",
    "unit": "mg/dL",
    "reference_range": "100-199",
    "result_status": "F",
    "collected": "2024-01-02T07:52:00-06:00",
    "resulted": "2024-01-02T10:28:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-002-41281", "result_code": "LK-CHOL" },
    "order_id": "NO-2024-57353"
  },
  "trig": {
    "type": "imported_result",
    "test": { "nfm_code": "TRIG", "name": "Triglycerides", "loinc": "2571-8" },
    "value": "131",
    "unit": "mg/dL",
    "reference_range": "0-149",
    "result_status": "F",
    "collected": "2024-01-02T07:52:00-06:00",
    "resulted": "2024-01-02T10:28:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-002-41281", "result_code": "LK-TRIG" },
    "order_id": "NO-2024-57353"
  },
  "hdl": {
    "type": "imported_result",
    "test": { "nfm_code": "HDL", "name": "HDL cholesterol", "loinc": "2085-9" },
    "value": "58",
    "unit": "mg/dL",
    "reference_range": ">39",
    "result_status": "F",
    "collected": "2024-01-02T07:52:00-06:00",
    "resulted": "2024-01-02T10:28:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-002-41281", "result_code": "LK-HDL" },
    "order_id": "NO-2024-57353"
  },
  "ldl": {
    "type": "imported_result",
    "test": { "nfm_code": "LDL-CALC", "name": "LDL cholesterol, calculated", "loinc": "13457-7" },
    "value": "110",
    "unit": "mg/dL",
    "reference_range": "0-99",
    "flag": "H",
    "result_status": "F",
    "collected": "2024-01-02T07:52:00-06:00",
    "resulted": "2024-01-02T10:28:00-06:00",
    "comment": "Calculated (Friedewald).",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-002-41281", "result_code": "LK-LDLC" },
    "order_id": "NO-2024-57353"
  }
}
```
