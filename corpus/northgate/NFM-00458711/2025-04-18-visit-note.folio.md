---
folio: "0.1"
id: "01JS5NJDK01DZ8PJCNEFSEDHYT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00458711"
effective: "2025-04-18T14:52:00-05:00"
recorded: "2025-04-18T19:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone f/u. Pt feeling better, vomiting resolved.
Eating and drinking normally, so metformin resumed today.
Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-041896",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
