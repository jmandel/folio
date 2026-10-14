---
folio: "0.1"
id: "01J5BKBC1GBPCVJZ0QESQ5K44C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00283863"
effective: "2024-08-15T13:03:00-05:00"
recorded: "2024-08-15T13:03:42-05:00"
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
    "med_id": "ML-19427",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "levothyroxine sodium 0.075 MG Oral Tablet", "rxnorm": "966222" },
    "dose": { "value": 75, "unit": "mcg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2024-081515"
  }
}
```
