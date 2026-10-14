---
folio: "0.1"
id: "01F2W505Y0WAR3V6ZC1Q7K70SP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165697"
effective: "2021-04-09T07:40:00-05:00"
recorded: "2021-04-09T15:26:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01F2VMBB50J9G2SEKQS4YF5NW2"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.36",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "flag": "H",
    "result_status": "F",
    "collected": "2021-04-09T07:40:00-05:00",
    "resulted": "2021-04-09T10:24:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-099-37711", "result_code": "LK-CREAT" },
    "order_id": "NO-2021-98089"
  },
  "egfr_naa": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR-NAA", "name": "eGFR (non-African American)", "loinc": "48642-3" },
    "value": "59",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "flag": "L",
    "result_status": "F",
    "collected": "2021-04-09T07:40:00-05:00",
    "resulted": "2021-04-09T10:24:00-05:00",
    "comment": "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-099-37711", "result_code": "LK-EGFR09N" },
    "order_id": "NO-2021-98089"
  },
  "egfr_aa": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR-AA", "name": "eGFR (African American)", "loinc": "48643-1" },
    "value": ">60",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2021-04-09T07:40:00-05:00",
    "resulted": "2021-04-09T10:24:00-05:00",
    "comment": "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-099-37711", "result_code": "LK-EGFR09A" },
    "order_id": "NO-2021-98089"
  },
  "na": {
    "type": "imported_result",
    "test": { "nfm_code": "NA", "name": "Sodium, serum", "loinc": "2951-2" },
    "value": "140",
    "unit": "mmol/L",
    "reference_range": "134-144",
    "result_status": "F",
    "collected": "2021-04-09T07:40:00-05:00",
    "resulted": "2021-04-09T10:24:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-099-37711", "result_code": "LK-NA" },
    "order_id": "NO-2021-54300"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2021-04-09T07:40:00-05:00",
    "resulted": "2021-04-09T15:22:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. CORRECTED 04/09/21 15:22: result invalidated, see recollected specimen LV21-099-09968.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV21-099-37711", "result_code": "LK-K" },
    "order_id": "NO-2021-92523"
  }
}
```
