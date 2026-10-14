---
folio: "0.1"
id: "01HFWFFA3GJZMHJWJ0QSZF8T3P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00143452"
effective: "2023-11-22T15:37:00-06:00"
recorded: "2023-11-22T15:37:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-11959",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "spironolactone 25 MG Oral Tablet", "rxnorm": "313096" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2023-112212"
  }
}
```
