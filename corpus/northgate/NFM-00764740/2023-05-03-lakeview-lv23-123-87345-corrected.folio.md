---
folio: "0.1"
id: "01GZHHY7E01V9AJ9A73538CKW5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00764740"
effective: "2023-05-03T07:42:00-05:00"
recorded: "2023-05-03T14:38:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01GZH24VJ0J87WVQJDRPKZVH35"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.95",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "result_status": "F",
    "collected": "2023-05-03T07:42:00-05:00",
    "resulted": "2023-05-03T09:51:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-123-87345", "result_code": "LK-CREAT" },
    "order_id": "NO-2023-91078"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "62",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2023-05-03T07:42:00-05:00",
    "resulted": "2023-05-03T09:51:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-123-87345", "result_code": "LK-EGFR21" },
    "order_id": "NO-2023-91078"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2023-05-03T07:42:00-05:00",
    "resulted": "2023-05-03T14:34:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 09:57. CORRECTED 05/03/23 14:34: result invalidated, see recollected specimen LV23-123-81597.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV23-123-87345", "result_code": "LK-K" },
    "order_id": "NO-2023-64865"
  }
}
```
