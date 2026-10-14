---
folio: "0.1"
id: "01GP1WBPN0NB87MPYF8KSXPVP1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00570381"
effective: "2023-01-05T07:42:00-06:00"
recorded: "2023-01-05T15:11:00-06:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01GP1ACR70PE265ZB59CKWNEMR"
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
    "collected": "2023-01-05T07:42:00-06:00",
    "resulted": "2023-01-05T09:46:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-005-60103", "result_code": "LK-CREAT" },
    "order_id": "NO-2023-99833"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "88",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2023-01-05T07:42:00-06:00",
    "resulted": "2023-01-05T09:46:00-06:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-005-60103", "result_code": "LK-EGFR21" },
    "order_id": "NO-2023-99833"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2023-01-05T07:42:00-06:00",
    "resulted": "2023-01-05T15:07:00-06:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to K. Foster RN 09:52. CORRECTED 01/05/23 15:07: result invalidated, see recollected specimen LV23-005-95502.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-005-60103", "result_code": "LK-K" },
    "order_id": "NO-2023-95025"
  },
  "chol": {
    "type": "imported_result",
    "test": { "nfm_code": "CHOL", "name": "Cholesterol, total", "loinc": "2093-3" },
    "value": "230",
    "unit": "mg/dL",
    "reference_range": "100-199",
    "flag": "H",
    "result_status": "F",
    "collected": "2023-01-05T07:42:00-06:00",
    "resulted": "2023-01-05T09:46:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-005-60103", "result_code": "LK-CHOL" },
    "order_id": "NO-2023-70954"
  },
  "trig": {
    "type": "imported_result",
    "test": { "nfm_code": "TRIG", "name": "Triglycerides", "loinc": "2571-8" },
    "value": "150",
    "unit": "mg/dL",
    "reference_range": "0-149",
    "flag": "H",
    "result_status": "F",
    "collected": "2023-01-05T07:42:00-06:00",
    "resulted": "2023-01-05T09:46:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-005-60103", "result_code": "LK-TRIG" },
    "order_id": "NO-2023-70954"
  },
  "hdl": {
    "type": "imported_result",
    "test": { "nfm_code": "HDL", "name": "HDL cholesterol", "loinc": "2085-9" },
    "value": "48",
    "unit": "mg/dL",
    "reference_range": ">39",
    "result_status": "F",
    "collected": "2023-01-05T07:42:00-06:00",
    "resulted": "2023-01-05T09:46:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-005-60103", "result_code": "LK-HDL" },
    "order_id": "NO-2023-70954"
  },
  "ldl": {
    "type": "imported_result",
    "test": { "nfm_code": "LDL-CALC", "name": "LDL cholesterol, calculated", "loinc": "13457-7" },
    "value": "152",
    "unit": "mg/dL",
    "reference_range": "0-99",
    "flag": "H",
    "result_status": "F",
    "collected": "2023-01-05T07:42:00-06:00",
    "resulted": "2023-01-05T09:46:00-06:00",
    "comment": "Calculated (Friedewald).",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-005-60103", "result_code": "LK-LDLC" },
    "order_id": "NO-2023-70954"
  }
}
```
