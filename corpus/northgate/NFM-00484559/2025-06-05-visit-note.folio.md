---
folio: "0.1"
id: "01JX1B94X0FGMGSXERZGWGMZH2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2025-06-05T15:52:00-05:00"
recorded: "2025-06-05T19:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt feeling better.

Eating and drinking normally. Metformin resumed today (eating and drinking normally).

Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-060586",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
