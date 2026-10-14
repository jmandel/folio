---
folio: "0.1"
id: "01EMRWC0VGRJCHAKG345QX6R6Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00031288"
effective: "2020-10-16T09:17:00-05:00"
recorded: "2020-10-16T09:17:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "med_id": "ML-44784",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "atorvastatin 20 MG Oral Tablet", "rxnorm": "617310" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime",
    "visit_id": "V-2020-101659"
  }
}
```
