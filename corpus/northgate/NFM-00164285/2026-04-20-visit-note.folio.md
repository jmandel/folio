---
folio: "0.1"
id: "01KPP79XY0D7XSB0MEW3XC4FYB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00164285"
effective: "2026-04-20T11:18:00-05:00"
recorded: "2026-04-20T14:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: feeling better.

metformin: resumed today (eating and drinking normally)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-042076",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
