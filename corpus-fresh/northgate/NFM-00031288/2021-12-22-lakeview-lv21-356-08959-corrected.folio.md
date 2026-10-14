---
folio: "0.1"
id: "01FQJ0D8S0CZQGT7DVSHAJGKP9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00031288"
effective: "2021-12-22T07:17:00-06:00"
recorded: "2021-12-22T15:23:00-06:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01FQHDXV003B91R84JN9RJ3YY2"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.63",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "flag": "H",
    "result_status": "F",
    "collected": "2021-12-22T07:17:00-06:00",
    "resulted": "2021-12-22T09:49:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-356-08959", "result_code": "LK-CREAT" },
    "order_id": "NO-2021-94540"
  },
  "egfr_naa": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR-NAA", "name": "eGFR (non-African American)", "loinc": "48642-3" },
    "value": "33",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "flag": "L",
    "result_status": "F",
    "collected": "2021-12-22T07:17:00-06:00",
    "resulted": "2021-12-22T09:49:00-06:00",
    "comment": "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-356-08959", "result_code": "LK-EGFR09N" },
    "order_id": "NO-2021-94540"
  },
  "egfr_aa": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR-AA", "name": "eGFR (African American)", "loinc": "48643-1" },
    "value": "38",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "flag": "L",
    "result_status": "F",
    "collected": "2021-12-22T07:17:00-06:00",
    "resulted": "2021-12-22T09:49:00-06:00",
    "comment": "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-356-08959", "result_code": "LK-EGFR09A" },
    "order_id": "NO-2021-94540"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2021-12-22T07:17:00-06:00",
    "resulted": "2021-12-22T15:19:00-06:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to K. Foster RN 09:55. CORRECTED 12/22/21 15:19: result invalidated, see recollected specimen LV21-356-62593.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-356-08959", "result_code": "LK-K" },
    "order_id": "NO-2021-76083"
  }
}
```
