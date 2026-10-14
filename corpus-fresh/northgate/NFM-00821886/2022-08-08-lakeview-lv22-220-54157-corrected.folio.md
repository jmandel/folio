---
folio: "0.1"
id: "01G9ZF69206R8PCNM8FRJJPAK7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821886"
effective: "2022-08-08T07:29:00-05:00"
recorded: "2022-08-08T14:34:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01G9Z0WGM0APXK270GHS00VPV1"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.85",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "result_status": "F",
    "collected": "2022-08-08T07:29:00-05:00",
    "resulted": "2022-08-08T10:13:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-220-54157", "result_code": "LK-CREAT" },
    "order_id": "NO-2022-68751"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "81",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2022-08-08T07:29:00-05:00",
    "resulted": "2022-08-08T10:13:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-220-54157", "result_code": "LK-EGFR21" },
    "order_id": "NO-2022-68751"
  },
  "na": {
    "type": "imported_result",
    "test": { "nfm_code": "NA", "name": "Sodium, serum", "loinc": "2951-2" },
    "value": "138",
    "unit": "mmol/L",
    "reference_range": "134-144",
    "result_status": "F",
    "collected": "2022-08-08T07:29:00-05:00",
    "resulted": "2022-08-08T10:13:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-220-54157", "result_code": "LK-NA" },
    "order_id": "NO-2022-57027"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2022-08-08T07:29:00-05:00",
    "resulted": "2022-08-08T14:30:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. CORRECTED 08/08/22 14:30: result invalidated, see recollected specimen LV22-220-52202.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-220-54157", "result_code": "LK-K" },
    "order_id": "NO-2022-83211"
  }
}
```
