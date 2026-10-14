---
folio: "0.1"
id: "01G7SVFN60RGCZR3EY5BJEABEJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00212600"
effective: "2022-07-12T07:33:00-05:00"
recorded: "2022-07-12T13:42:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01G7SE50V0ESV11YDV7AVESXRQ"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.93",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "result_status": "F",
    "collected": "2022-07-12T07:33:00-05:00",
    "resulted": "2022-07-12T09:38:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-193-15092", "result_code": "LK-CREAT" },
    "order_id": "NO-2022-90287"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": ">90",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2022-07-12T07:33:00-05:00",
    "resulted": "2022-07-12T09:38:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-193-15092", "result_code": "LK-EGFR21" },
    "order_id": "NO-2022-90287"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2022-07-12T07:33:00-05:00",
    "resulted": "2022-07-12T13:38:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 09:44. CORRECTED 07/12/22 13:38: result invalidated, see recollected specimen LV22-193-27556.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-193-15092", "result_code": "LK-K" },
    "order_id": "NO-2022-54104"
  }
}
```
