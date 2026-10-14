---
folio: "0.1"
id: "01GHEYAKV0S6D3TTQKF4DS6D3W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2022-11-09T07:27:00-06:00"
recorded: "2022-11-09T13:37:00-06:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01GHEHM410AA9FAWJXH46Z6W6P"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.29",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "flag": "H",
    "result_status": "F",
    "collected": "2022-11-09T07:27:00-06:00",
    "resulted": "2022-11-09T09:44:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-313-91551", "result_code": "LK-CREAT" },
    "order_id": "NO-2022-61134"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "65",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2022-11-09T07:27:00-06:00",
    "resulted": "2022-11-09T09:44:00-06:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-313-91551", "result_code": "LK-EGFR21" },
    "order_id": "NO-2022-61134"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2022-11-09T07:27:00-06:00",
    "resulted": "2022-11-09T13:33:00-06:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 09:50. CORRECTED 11/09/22 13:33: result invalidated, see recollected specimen LV22-313-49092.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-313-91551", "result_code": "LK-K" },
    "order_id": "NO-2022-98453"
  }
}
```
