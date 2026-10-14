---
folio: "0.1"
id: "01JE4B1AZ0CNKX7EZRSPDP5W5K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00457036"
effective: "2024-12-02T10:24:00-06:00"
recorded: "2024-12-02T12:45:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt feeling better.

Eating and drinking normally, so metformin resumed today.
Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-120277",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
