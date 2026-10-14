---
folio: "0.1"
id: "01ESGY1XSG1ZM58HXKM6T7FRRH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00634370"
effective: "2020-12-14T09:31:00-06:00"
recorded: "2020-12-14T09:31:42-06:00"
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
    "med_id": "ML-35881",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "atorvastatin 20 MG Oral Tablet", "rxnorm": "617310" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime",
    "visit_id": "V-2020-121453"
  }
}
```
