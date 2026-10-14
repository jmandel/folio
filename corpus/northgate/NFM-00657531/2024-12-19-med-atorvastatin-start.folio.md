---
folio: "0.1"
id: "01JFG6GWWG0T3X3DW3261CRBBM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00657531"
effective: "2024-12-19T13:32:00-06:00"
recorded: "2024-12-19T13:32:42-06:00"
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
    "med_id": "ML-24295",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "atorvastatin 40 MG Oral Tablet", "rxnorm": "617311" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime",
    "visit_id": "V-2024-121996"
  }
}
```
