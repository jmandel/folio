---
folio: "0.1"
id: "01GPEMV1VGX6RRVDNPGD4AN69F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00060786"
effective: "2023-01-10T14:09:00-06:00"
recorded: "2023-01-10T14:09:42-06:00"
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
    "med_id": "ML-43541",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "24 HR metoprolol succinate 50 MG Extended Release Oral Tablet", "rxnorm": "866436" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily"
  }
}
```
