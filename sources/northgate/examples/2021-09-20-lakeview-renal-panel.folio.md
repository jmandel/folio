---
folio: "0.1"
id: "01FG2CVEN0TEWH0AVNH9DN65R6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2021-09-20T08:14:00-05:00"
recorded: "2021-09-20T15:02:44-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "TODO"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.12",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "flag": "H",
    "result_status": "F",
    "collected": "2021-09-20T08:14:00-05:00",
    "resulted": "2021-09-20T14:51:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-263-00417", "result_code": "LK-CREAT" },
    "order_id": "NO-2021-55120"
  },
  "egfr_naa": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR-NAA", "name": "eGFR (non-African American)", "loinc": "48642-3" },
    "value": "55",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "flag": "L",
    "result_status": "F",
    "collected": "2021-09-20T08:14:00-05:00",
    "resulted": "2021-09-20T14:51:00-05:00",
    "comment": "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-263-00417", "result_code": "LK-EGFR09N" },
    "order_id": "NO-2021-55120"
  },
  "egfr_aa": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR-AA", "name": "eGFR (African American)", "loinc": "48643-1" },
    "value": "64",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2021-09-20T08:14:00-05:00",
    "resulted": "2021-09-20T14:51:00-05:00",
    "comment": "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-263-00417", "result_code": "LK-EGFR09A" },
    "order_id": "NO-2021-55120"
  }
}
```
