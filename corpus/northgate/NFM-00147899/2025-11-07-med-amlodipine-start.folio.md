---
folio: "0.1"
id: "01K9G7WKWG5NY3D6KMJHD7J5JS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00147899"
effective: "2025-11-07T16:44:00-06:00"
recorded: "2025-11-07T16:44:42-06:00"
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
    "med_id": "ML-31620",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "amlodipine 10 MG Oral Tablet", "rxnorm": "308135" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily"
  }
}
```
