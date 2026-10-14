---
folio: "0.1"
id: "01HK5Y5Z90PJ6VEW046ZY9EARK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00869685"
effective: "2024-01-02T07:52:00-06:00"
recorded: "2024-01-02T14:35:00-06:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01HK5D7ZH0S7F0Y3ZPT8RF2783"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.78",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "result_status": "F",
    "collected": "2024-01-02T07:52:00-06:00",
    "resulted": "2024-01-02T09:28:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-002-67014", "result_code": "LK-CREAT" },
    "order_id": "NO-2024-75509"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": ">90",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2024-01-02T07:52:00-06:00",
    "resulted": "2024-01-02T09:28:00-06:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-002-67014", "result_code": "LK-EGFR21" },
    "order_id": "NO-2024-75509"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2024-01-02T07:52:00-06:00",
    "resulted": "2024-01-02T14:31:00-06:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 09:34. CORRECTED 01/02/24 14:31: result invalidated, see recollected specimen LV24-002-33891.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV24-002-67014", "result_code": "LK-K" },
    "order_id": "NO-2024-82812"
  }
}
```
