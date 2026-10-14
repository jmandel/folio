---
folio: "0.1"
id: "01HMW6WA60BCH3VZXGPYCVE4YH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00620040"
effective: "2024-01-23T12:08:00-06:00"
recorded: "2024-01-23T16:26:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, feeling better.
Vomiting has stopped. Metformin resumed today, eating and drinking normally.
Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-012326",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
