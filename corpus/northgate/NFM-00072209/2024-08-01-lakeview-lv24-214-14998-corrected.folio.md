---
folio: "0.1"
id: "01J47PKNG0P49T0BS9AGDPR88R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00072209"
effective: "2024-08-01T07:16:00-05:00"
recorded: "2024-08-01T14:28:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01J475QGB0Q4ENKXJ9ZEW7098Y"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "2.33",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "flag": "H",
    "result_status": "F",
    "collected": "2024-08-01T07:16:00-05:00",
    "resulted": "2024-08-01T09:22:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-214-14998", "result_code": "LK-CREAT" },
    "order_id": "NO-2024-97586"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "34",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "flag": "L",
    "result_status": "F",
    "collected": "2024-08-01T07:16:00-05:00",
    "resulted": "2024-08-01T09:22:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-214-14998", "result_code": "LK-EGFR21" },
    "order_id": "NO-2024-97586"
  },
  "na": {
    "type": "imported_result",
    "test": { "nfm_code": "NA", "name": "Sodium, serum", "loinc": "2951-2" },
    "value": "133",
    "unit": "mmol/L",
    "reference_range": "134-144",
    "flag": "L",
    "result_status": "F",
    "collected": "2024-08-01T07:16:00-05:00",
    "resulted": "2024-08-01T09:22:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-214-14998", "result_code": "LK-NA" },
    "order_id": "NO-2024-89155"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2024-08-01T07:16:00-05:00",
    "resulted": "2024-08-01T14:24:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to K. Foster RN 09:28. CORRECTED 08/01/24 14:24: result invalidated, see recollected specimen LV24-214-90313.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-214-14998", "result_code": "LK-K" },
    "order_id": "NO-2024-76382"
  }
}
```
