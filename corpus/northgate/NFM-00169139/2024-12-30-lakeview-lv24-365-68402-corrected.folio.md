---
folio: "0.1"
id: "01JGCMSVV0HC55MT38BFF4127Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00169139"
effective: "2024-12-30T07:41:00-06:00"
recorded: "2024-12-30T14:41:00-06:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01JGC39J5027HK9H4K2HY1J8AP"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.89",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "result_status": "F",
    "collected": "2024-12-30T07:41:00-06:00",
    "resulted": "2024-12-30T09:24:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-365-68402", "result_code": "LK-CREAT" },
    "order_id": "NO-2024-61642"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": ">90",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2024-12-30T07:41:00-06:00",
    "resulted": "2024-12-30T09:24:00-06:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-365-68402", "result_code": "LK-EGFR21" },
    "order_id": "NO-2024-61642"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2024-12-30T07:41:00-06:00",
    "resulted": "2024-12-30T14:37:00-06:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 09:30. CORRECTED 12/30/24 14:37: result invalidated, see recollected specimen LV24-365-29016.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-365-68402", "result_code": "LK-K" },
    "order_id": "NO-2024-86833"
  }
}
```
