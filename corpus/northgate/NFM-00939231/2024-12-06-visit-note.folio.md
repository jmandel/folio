---
folio: "0.1"
id: "01JEET9FR0CJF56J5PBBFM9RG0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939231"
effective: "2024-12-06T09:28:00-06:00"
recorded: "2024-12-06T14:24:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt feeling better, vomiting has stopped.
Metformin resumed today (eating and drinking normally).
Call if symptoms return. Keep next scheduled f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-120612",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
