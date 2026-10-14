---
folio: "0.1"
id: "01GHF0CH70M2T6S83XQE5SBBAV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2022-11-09T07:27:00-06:00"
recorded: "2022-11-09T14:13:00-06:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01GHEHJ9E06H60CEJQAMDGZZ8Q"
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
    "resulted": "2022-11-09T09:43:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-313-82534", "result_code": "LK-CREAT" },
    "order_id": "NO-2022-51336"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "65",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2022-11-09T07:27:00-06:00",
    "resulted": "2022-11-09T09:43:00-06:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-313-82534", "result_code": "LK-EGFR21" },
    "order_id": "NO-2022-51336"
  },
  "na": {
    "type": "imported_result",
    "test": { "nfm_code": "NA", "name": "Sodium, serum", "loinc": "2951-2" },
    "value": "135",
    "unit": "mmol/L",
    "reference_range": "134-144",
    "result_status": "F",
    "collected": "2022-11-09T07:27:00-06:00",
    "resulted": "2022-11-09T09:43:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-313-82534", "result_code": "LK-NA" },
    "order_id": "NO-2022-90437"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2022-11-09T07:27:00-06:00",
    "resulted": "2022-11-09T14:09:00-06:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. CORRECTED 11/09/22 14:09: result invalidated, see recollected specimen LV22-313-95648.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-313-82534", "result_code": "LK-K" },
    "order_id": "NO-2022-97940"
  }
}
```
