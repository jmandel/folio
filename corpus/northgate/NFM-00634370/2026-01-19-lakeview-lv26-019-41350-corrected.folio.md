---
folio: "0.1"
id: "01KFC0JCJ0KHS4WT9QDS324WZ8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00634370"
effective: "2026-01-19T07:43:00-06:00"
recorded: "2026-01-19T14:54:00-06:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01KFBGHPA0P1H43C2RWWZ2NVM2"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "2.00",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "flag": "H",
    "result_status": "F",
    "collected": "2026-01-19T07:43:00-06:00",
    "resulted": "2026-01-19T10:03:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-019-41350", "result_code": "LK-CREAT" },
    "order_id": "NO-2026-54626"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "38",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "flag": "L",
    "result_status": "F",
    "collected": "2026-01-19T07:43:00-06:00",
    "resulted": "2026-01-19T10:03:00-06:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-019-41350", "result_code": "LK-EGFR21" },
    "order_id": "NO-2026-54626"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2026-01-19T07:43:00-06:00",
    "resulted": "2026-01-19T14:50:00-06:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to K. Foster RN 10:09. CORRECTED 01/19/26 14:50: result invalidated, see recollected specimen LV26-019-95950.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-019-41350", "result_code": "LK-K" },
    "order_id": "NO-2026-86940"
  }
}
```
