---
folio: "0.1"
id: "01HXF553S05C6GKKB2E92TKXTZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00323182"
effective: "2024-05-09T10:05:00-05:00"
recorded: "2024-05-09T12:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
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
    "visit_id": "V-2024-050975",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
