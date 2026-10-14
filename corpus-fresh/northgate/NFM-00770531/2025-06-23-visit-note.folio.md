---
folio: "0.1"
id: "01JYFSZKQ0P5Q4VX32DY78T28F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770531"
effective: "2025-06-23T14:36:00-05:00"
recorded: "2025-06-23T20:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "visit_id": "V-2025-062376",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
