---
folio: "0.1"
id: "01K8V8R5SG6M684KAK6AVFNMK9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00784235"
effective: "2025-10-30T14:15:00-05:00"
recorded: "2025-10-30T14:15:42-05:00"
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
    "med_id": "ML-17214",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "24 HR metoprolol succinate 50 MG Extended Release Oral Tablet", "rxnorm": "866436" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily"
  }
}
```
