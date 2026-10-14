---
folio: "0.1"
id: "01K0CZ6TY03JA8KY5PTX1YSN72"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00050237"
effective: "2025-07-17T07:30:00-05:00"
recorded: "2025-07-17T14:54:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01K0CDJW209G97E7VVDNRW5V8K"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.33",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "flag": "H",
    "result_status": "F",
    "collected": "2025-07-17T07:30:00-05:00",
    "resulted": "2025-07-17T09:35:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-198-94997", "result_code": "LK-CREAT" },
    "order_id": "NO-2025-70932"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "55",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "flag": "L",
    "result_status": "F",
    "collected": "2025-07-17T07:30:00-05:00",
    "resulted": "2025-07-17T09:35:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-198-94997", "result_code": "LK-EGFR21" },
    "order_id": "NO-2025-70932"
  },
  "na": {
    "type": "imported_result",
    "test": { "nfm_code": "NA", "name": "Sodium, serum", "loinc": "2951-2" },
    "value": "137",
    "unit": "mmol/L",
    "reference_range": "134-144",
    "result_status": "F",
    "collected": "2025-07-17T07:30:00-05:00",
    "resulted": "2025-07-17T09:35:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-198-94997", "result_code": "LK-NA" },
    "order_id": "NO-2025-61921"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2025-07-17T07:30:00-05:00",
    "resulted": "2025-07-17T14:50:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. CORRECTED 07/17/25 14:50: result invalidated, see recollected specimen LV25-198-24873.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-198-94997", "result_code": "LK-K" },
    "order_id": "NO-2025-79376"
  }
}
```
