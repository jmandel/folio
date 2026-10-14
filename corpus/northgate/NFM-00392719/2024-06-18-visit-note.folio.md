---
folio: "0.1"
id: "01J0PNW6B0MKB0DZT4GB0YK7J8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2024-06-18T13:41:00-05:00"
recorded: "2024-06-18T17:01:00-05:00"
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

Eating and drinking normally. Metformin resumed today.

Call if symptoms return. Keep scheduled f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-061841",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
