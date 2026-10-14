---
folio: "0.1"
id: "01FYW6R000ZY90YZQAJGCVHCJY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00228032"
effective: "2022-03-23T07:33:00-05:00"
recorded: "2022-03-23T15:16:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01FYVMS1J0FHJ4P48BYPBBH7GD"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.93",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "result_status": "F",
    "collected": "2022-03-23T07:33:00-05:00",
    "resulted": "2022-03-23T09:51:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-082-19015", "result_code": "LK-CREAT" },
    "order_id": "NO-2022-85438"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "64",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2022-03-23T07:33:00-05:00",
    "resulted": "2022-03-23T09:51:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-082-19015", "result_code": "LK-EGFR21" },
    "order_id": "NO-2022-85438"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2022-03-23T07:33:00-05:00",
    "resulted": "2022-03-23T15:12:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. CORRECTED 03/23/22 15:12: result invalidated, see recollected specimen LV22-082-58520.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-082-19015", "result_code": "LK-K" },
    "order_id": "NO-2022-92163"
  }
}
```
