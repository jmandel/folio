---
folio: "0.1"
id: "01GKQ4DYQ0TV4ZC1EXFQB1ZT0W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00060786"
effective: "2022-12-07T07:43:00-06:00"
recorded: "2022-12-07T14:29:00-06:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01GKPPH0E08GC5QDYCRJWNAPSG"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.02",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "result_status": "F",
    "collected": "2022-12-07T07:43:00-06:00",
    "resulted": "2022-12-07T10:15:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-341-01381", "result_code": "LK-CREAT" },
    "order_id": "NO-2022-62264"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "85",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2022-12-07T07:43:00-06:00",
    "resulted": "2022-12-07T10:15:00-06:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-341-01381", "result_code": "LK-EGFR21" },
    "order_id": "NO-2022-62264"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2022-12-07T07:43:00-06:00",
    "resulted": "2022-12-07T14:25:00-06:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. CORRECTED 12/07/22 14:25: result invalidated, see recollected specimen LV22-341-42356.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-341-01381", "result_code": "LK-K" },
    "order_id": "NO-2022-92331"
  }
}
```
