---
folio: "0.1"
id: "01JSCX4PG0SNBA1XYZ4P22GHRS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00560147"
effective: "2025-04-21T07:24:00-05:00"
recorded: "2025-04-21T14:28:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01JSCBD2E0WQSQKTB1N6PW5BRF"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.04",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "result_status": "F",
    "collected": "2025-04-21T07:24:00-05:00",
    "resulted": "2025-04-21T09:07:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-111-13278", "result_code": "LK-CREAT" },
    "order_id": "NO-2025-77103"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "77",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2025-04-21T07:24:00-05:00",
    "resulted": "2025-04-21T09:07:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-111-13278", "result_code": "LK-EGFR21" },
    "order_id": "NO-2025-77103"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2025-04-21T07:24:00-05:00",
    "resulted": "2025-04-21T14:24:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to K. Foster RN 09:13. CORRECTED 04/21/25 14:24: result invalidated, see recollected specimen LV25-111-31066.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-111-13278", "result_code": "LK-K" },
    "order_id": "NO-2025-53174"
  },
  "chol": {
    "type": "imported_result",
    "test": { "nfm_code": "CHOL", "name": "Cholesterol, total", "loinc": "2093-3" },
    "value": "209",
    "unit": "mg/dL",
    "reference_range": "100-199",
    "flag": "H",
    "result_status": "F",
    "collected": "2025-04-21T07:24:00-05:00",
    "resulted": "2025-04-21T09:07:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-111-13278", "result_code": "LK-CHOL" },
    "order_id": "NO-2025-96891"
  },
  "trig": {
    "type": "imported_result",
    "test": { "nfm_code": "TRIG", "name": "Triglycerides", "loinc": "2571-8" },
    "value": "148",
    "unit": "mg/dL",
    "reference_range": "0-149",
    "result_status": "F",
    "collected": "2025-04-21T07:24:00-05:00",
    "resulted": "2025-04-21T09:07:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-111-13278", "result_code": "LK-TRIG" },
    "order_id": "NO-2025-96891"
  },
  "hdl": {
    "type": "imported_result",
    "test": { "nfm_code": "HDL", "name": "HDL cholesterol", "loinc": "2085-9" },
    "value": "56",
    "unit": "mg/dL",
    "reference_range": ">39",
    "result_status": "F",
    "collected": "2025-04-21T07:24:00-05:00",
    "resulted": "2025-04-21T09:07:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-111-13278", "result_code": "LK-HDL" },
    "order_id": "NO-2025-96891"
  },
  "ldl": {
    "type": "imported_result",
    "test": { "nfm_code": "LDL-CALC", "name": "LDL cholesterol, calculated", "loinc": "13457-7" },
    "value": "123",
    "unit": "mg/dL",
    "reference_range": "0-99",
    "flag": "H",
    "result_status": "F",
    "collected": "2025-04-21T07:24:00-05:00",
    "resulted": "2025-04-21T09:07:00-05:00",
    "comment": "Calculated (Friedewald).",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-111-13278", "result_code": "LK-LDLC" },
    "order_id": "NO-2025-96891"
  }
}
```
