---
folio: "0.1"
id: "01KV8ZARD00VFWETKHM85PV7PG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00302644"
effective: "2026-06-16T07:26:00-05:00"
recorded: "2026-06-16T14:43:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01KV8D0TD0019N51D2M2TNSYQ5"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.83",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "result_status": "F",
    "collected": "2026-06-16T07:26:00-05:00",
    "resulted": "2026-06-16T09:12:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-167-26214", "result_code": "LK-CREAT" },
    "order_id": "NO-2026-67685"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "77",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2026-06-16T07:26:00-05:00",
    "resulted": "2026-06-16T09:12:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-167-26214", "result_code": "LK-EGFR21" },
    "order_id": "NO-2026-67685"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2026-06-16T07:26:00-05:00",
    "resulted": "2026-06-16T14:39:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 09:18. CORRECTED 06/16/26 14:39: result invalidated, see recollected specimen LV26-167-97850.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-167-26214", "result_code": "LK-K" },
    "order_id": "NO-2026-91544"
  }
}
```
