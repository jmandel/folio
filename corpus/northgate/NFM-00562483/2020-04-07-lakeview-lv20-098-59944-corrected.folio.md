---
folio: "0.1"
id: "01E5B473E00V6NMM52PBW3B7VG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00562483"
effective: "2020-04-07T07:50:00-05:00"
recorded: "2020-04-07T15:10:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01E5AKAY90QF1FKR90CD3JJ5ZC"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.91",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "result_status": "F",
    "collected": "2020-04-07T07:50:00-05:00",
    "resulted": "2020-04-07T10:04:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV20-098-59944", "result_code": "LK-CREAT" },
    "order_id": "NO-2020-81237"
  },
  "egfr_naa": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR-NAA", "name": "eGFR (non-African American)", "loinc": "48642-3" },
    "value": ">60",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2020-04-07T07:50:00-05:00",
    "resulted": "2020-04-07T10:04:00-05:00",
    "comment": "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV20-098-59944", "result_code": "LK-EGFR09N" },
    "order_id": "NO-2020-81237"
  },
  "egfr_aa": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR-AA", "name": "eGFR (African American)", "loinc": "48643-1" },
    "value": ">60",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2020-04-07T07:50:00-05:00",
    "resulted": "2020-04-07T10:04:00-05:00",
    "comment": "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV20-098-59944", "result_code": "LK-EGFR09A" },
    "order_id": "NO-2020-81237"
  },
  "na": {
    "type": "imported_result",
    "test": { "nfm_code": "NA", "name": "Sodium, serum", "loinc": "2951-2" },
    "value": "134",
    "unit": "mmol/L",
    "reference_range": "134-144",
    "result_status": "F",
    "collected": "2020-04-07T07:50:00-05:00",
    "resulted": "2020-04-07T10:04:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV20-098-59944", "result_code": "LK-NA" },
    "order_id": "NO-2020-70928"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2020-04-07T07:50:00-05:00",
    "resulted": "2020-04-07T15:06:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 10:10. CORRECTED 04/07/20 15:06: result invalidated, see recollected specimen LV20-098-52308.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV20-098-59944", "result_code": "LK-K" },
    "order_id": "NO-2020-75624"
  },
  "glu": {
    "type": "imported_result",
    "test": { "nfm_code": "GLU", "name": "Glucose, serum", "loinc": "2345-7" },
    "value": "87",
    "unit": "mg/dL",
    "reference_range": "70-99",
    "result_status": "F",
    "collected": "2020-04-07T07:50:00-05:00",
    "resulted": "2020-04-07T10:04:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV20-098-59944", "result_code": "LK-GLU" },
    "order_id": "NO-2020-99906"
  },
  "chol": {
    "type": "imported_result",
    "test": { "nfm_code": "CHOL", "name": "Cholesterol, total", "loinc": "2093-3" },
    "value": "184",
    "unit": "mg/dL",
    "reference_range": "100-199",
    "result_status": "F",
    "collected": "2020-04-07T07:50:00-05:00",
    "resulted": "2020-04-07T10:04:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV20-098-59944", "result_code": "LK-CHOL" },
    "order_id": "NO-2020-52529"
  },
  "trig": {
    "type": "imported_result",
    "test": { "nfm_code": "TRIG", "name": "Triglycerides", "loinc": "2571-8" },
    "value": "67",
    "unit": "mg/dL",
    "reference_range": "0-149",
    "result_status": "F",
    "collected": "2020-04-07T07:50:00-05:00",
    "resulted": "2020-04-07T10:04:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV20-098-59944", "result_code": "LK-TRIG" },
    "order_id": "NO-2020-52529"
  },
  "hdl": {
    "type": "imported_result",
    "test": { "nfm_code": "HDL", "name": "HDL cholesterol", "loinc": "2085-9" },
    "value": "54",
    "unit": "mg/dL",
    "reference_range": ">39",
    "result_status": "F",
    "collected": "2020-04-07T07:50:00-05:00",
    "resulted": "2020-04-07T10:04:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV20-098-59944", "result_code": "LK-HDL" },
    "order_id": "NO-2020-52529"
  },
  "ldl": {
    "type": "imported_result",
    "test": { "nfm_code": "LDL-CALC", "name": "LDL cholesterol, calculated", "loinc": "13457-7" },
    "value": "117",
    "unit": "mg/dL",
    "reference_range": "0-99",
    "flag": "H",
    "result_status": "F",
    "collected": "2020-04-07T07:50:00-05:00",
    "resulted": "2020-04-07T10:04:00-05:00",
    "comment": "Calculated (Friedewald).",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV20-098-59944", "result_code": "LK-LDLC" },
    "order_id": "NO-2020-52529"
  }
}
```
