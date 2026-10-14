---
folio: "0.1"
id: "01HYEB86J0Z8EBKVZ9VWJY6FVK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00158160"
effective: "2024-05-21T07:44:00-05:00"
recorded: "2024-05-21T14:50:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01HYDSVJ20FGD8T6NHW9EG02T9"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.55",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "flag": "H",
    "result_status": "F",
    "collected": "2024-05-21T07:44:00-05:00",
    "resulted": "2024-05-21T09:35:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-142-71263", "result_code": "LK-CREAT" },
    "order_id": "NO-2024-58333"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "50",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "flag": "L",
    "result_status": "F",
    "collected": "2024-05-21T07:44:00-05:00",
    "resulted": "2024-05-21T09:35:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-142-71263", "result_code": "LK-EGFR21" },
    "order_id": "NO-2024-58333"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2024-05-21T07:44:00-05:00",
    "resulted": "2024-05-21T14:46:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to K. Foster RN 09:41. CORRECTED 05/21/24 14:46: result invalidated, see recollected specimen LV24-142-51037.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-142-71263", "result_code": "LK-K" },
    "order_id": "NO-2024-91034"
  }
}
```
