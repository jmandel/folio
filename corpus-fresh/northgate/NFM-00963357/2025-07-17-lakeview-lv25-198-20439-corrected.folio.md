---
folio: "0.1"
id: "01K0D0VY50P7X9G65BVCE1DYS6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00963357"
effective: "2025-07-17T07:32:00-05:00"
recorded: "2025-07-17T15:23:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01K0CFT970K91FM1TE7HPG3MBG"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.09",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "result_status": "F",
    "collected": "2025-07-17T07:32:00-05:00",
    "resulted": "2025-07-17T10:14:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-198-20439", "result_code": "LK-CREAT" },
    "order_id": "NO-2025-98399"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "75",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2025-07-17T07:32:00-05:00",
    "resulted": "2025-07-17T10:14:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-198-20439", "result_code": "LK-EGFR21" },
    "order_id": "NO-2025-98399"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2025-07-17T07:32:00-05:00",
    "resulted": "2025-07-17T15:19:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to K. Foster RN 10:20. CORRECTED 07/17/25 15:19: result invalidated, see recollected specimen LV25-198-84859.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-198-20439", "result_code": "LK-K" },
    "order_id": "NO-2025-64289"
  }
}
```
