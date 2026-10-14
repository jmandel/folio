---
folio: "0.1"
id: "01FABHG9D0VDKXECM00ERMFJG1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2021-07-11T07:59:00-05:00"
recorded: "2021-07-11T14:43:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01FAB0Z3T07QZPX8FN1S25PS3N"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.13",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "flag": "H",
    "result_status": "F",
    "collected": "2021-07-11T07:59:00-05:00",
    "resulted": "2021-07-11T09:43:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-192-58280", "result_code": "LK-CREAT" },
    "order_id": "NO-2021-64621"
  },
  "egfr_naa": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR-NAA", "name": "eGFR (non-African American)", "loinc": "48642-3" },
    "value": "61",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2021-07-11T07:59:00-05:00",
    "resulted": "2021-07-11T09:43:00-05:00",
    "comment": "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-192-58280", "result_code": "LK-EGFR09N" },
    "order_id": "NO-2021-64621"
  },
  "egfr_aa": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR-AA", "name": "eGFR (African American)", "loinc": "48643-1" },
    "value": "70",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2021-07-11T07:59:00-05:00",
    "resulted": "2021-07-11T09:43:00-05:00",
    "comment": "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-192-58280", "result_code": "LK-EGFR09A" },
    "order_id": "NO-2021-64621"
  },
  "na": {
    "type": "imported_result",
    "test": { "nfm_code": "NA", "name": "Sodium, serum", "loinc": "2951-2" },
    "value": "137",
    "unit": "mmol/L",
    "reference_range": "134-144",
    "result_status": "F",
    "collected": "2021-07-11T07:59:00-05:00",
    "resulted": "2021-07-11T09:43:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-192-58280", "result_code": "LK-NA" },
    "order_id": "NO-2021-87318"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2021-07-11T07:59:00-05:00",
    "resulted": "2021-07-11T14:39:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to K. Foster RN 09:49. CORRECTED 07/11/21 14:39: result invalidated, see recollected specimen LV21-192-00874.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-192-58280", "result_code": "LK-K" },
    "order_id": "NO-2021-87942"
  }
}
```
