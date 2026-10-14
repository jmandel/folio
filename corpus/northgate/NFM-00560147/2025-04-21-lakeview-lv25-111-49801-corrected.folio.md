---
folio: "0.1"
id: "01JSD14W20WJYFX92X7F471JWQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00560147"
effective: "2025-04-21T07:24:00-05:00"
recorded: "2025-04-21T15:38:00-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01JSCDPA60PZP90SXT047088GV"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "1.04",
    "unit": "mg/dL",
    "reference_range": "0.76-1.27",
    "result_status": "F",
    "collected": "2025-04-21T07:24:00-05:00",
    "resulted": "2025-04-21T09:47:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-111-49801", "result_code": "LK-CREAT" },
    "order_id": "NO-2025-94954"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "77",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2025-04-21T07:24:00-05:00",
    "resulted": "2025-04-21T09:47:00-05:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-111-49801", "result_code": "LK-EGFR21" },
    "order_id": "NO-2025-94954"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2025-04-21T07:24:00-05:00",
    "resulted": "2025-04-21T15:34:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to K. Foster RN 09:53. CORRECTED 04/21/25 15:34: result invalidated, see recollected specimen LV25-111-48846.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-111-49801", "result_code": "LK-K" },
    "order_id": "NO-2025-86274"
  }
}
```
