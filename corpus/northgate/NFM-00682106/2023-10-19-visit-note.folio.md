---
folio: "0.1"
id: "01HD51PE9076XPC7V2JMTH3V6D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00682106"
effective: "2023-10-19T12:16:00-05:00"
recorded: "2023-10-19T17:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt feeling better, vomiting resolved.

Metformin resumed today (eating and drinking normally).
Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-101941",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
