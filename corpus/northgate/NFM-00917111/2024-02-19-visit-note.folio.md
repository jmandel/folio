---
folio: "0.1"
id: "01HQ19MYA0QC5XJQ25EPNCPB95"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00917111"
effective: "2024-02-19T09:47:00-06:00"
recorded: "2024-02-19T12:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "visit_id": "V-2024-021912",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
