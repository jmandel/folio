---
folio: "0.1"
id: "01F47RS390NZFDN2ZFV7AE7SK6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922394"
effective: "2021-04-26T07:29:00-05:00"
recorded: "2021-04-26T13:59:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01F47BG9H00KZ7C2CGVHFK4S7F"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.04",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "flag": "H",
    "result_status": "F",
    "collected": "2021-04-26T07:29:00-05:00",
    "resulted": "2021-04-26T09:56:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-116-76764", "result_code": "LK-CREAT" },
    "order_id": "NO-2021-87571"
  },
  "egfr_naa": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR-NAA", "name": "eGFR (non-African American)", "loinc": "48642-3" },
    "value": ">60",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2021-04-26T07:29:00-05:00",
    "resulted": "2021-04-26T09:56:00-05:00",
    "comment": "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-116-76764", "result_code": "LK-EGFR09N" },
    "order_id": "NO-2021-87571"
  },
  "egfr_aa": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR-AA", "name": "eGFR (African American)", "loinc": "48643-1" },
    "value": ">60",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2021-04-26T07:29:00-05:00",
    "resulted": "2021-04-26T09:56:00-05:00",
    "comment": "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-116-76764", "result_code": "LK-EGFR09A" },
    "order_id": "NO-2021-87571"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2021-04-26T07:29:00-05:00",
    "resulted": "2021-04-26T13:55:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 10:02. CORRECTED 04/26/21 13:55: result invalidated, see recollected specimen LV21-116-80581.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-116-76764", "result_code": "LK-K" },
    "order_id": "NO-2021-70094"
  }
}
```
