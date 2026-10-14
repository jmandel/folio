---
folio: "0.1"
id: "01J6WVJ520KSDVTQQSJJCK8YVF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00146853"
effective: "2024-09-03T07:55:00-05:00"
recorded: "2024-09-03T16:10:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01J6W675K021ZMRX3B6AEB2802"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.99",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "result_status": "F",
    "collected": "2024-09-03T07:55:00-05:00",
    "resulted": "2024-09-03T09:46:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-247-98451", "result_code": "LK-CREAT" },
    "order_id": "NO-2024-62683"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "80",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2024-09-03T07:55:00-05:00",
    "resulted": "2024-09-03T09:46:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-247-98451", "result_code": "LK-EGFR21" },
    "order_id": "NO-2024-62683"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2024-09-03T07:55:00-05:00",
    "resulted": "2024-09-03T16:06:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 09:52. CORRECTED 09/03/24 16:06: result invalidated, see recollected specimen LV24-247-32221.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-247-98451", "result_code": "LK-K" },
    "order_id": "NO-2024-77655"
  }
}
```
