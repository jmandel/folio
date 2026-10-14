---
folio: "0.1"
id: "01F5ERT7J0QBQSF0ZAKVJZBHC6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00994489"
effective: "2021-05-11T14:28:00-05:00"
recorded: "2021-05-11T17:30:00-05:00"
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

lisinopril: resumed today (eating and drinking normally)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-051198",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
