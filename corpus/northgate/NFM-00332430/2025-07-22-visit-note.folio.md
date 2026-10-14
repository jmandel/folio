---
folio: "0.1"
id: "01K0T3Q8D0VXN35GNGFC4P4F5G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00332430"
effective: "2025-07-22T11:13:00-05:00"
recorded: "2025-07-22T17:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt feeling better, vomiting has stopped.

Metformin resumed today, eating and drinking normally.

Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-072246",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
