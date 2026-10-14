---
folio: "0.1"
id: "01G7QJJWR0BR0HT0FKZZ6MB5E5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00880931"
effective: "2022-07-11T14:34:00-05:00"
recorded: "2022-07-11T16:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt feeling better, vomiting resolved.
Metformin resumed today (eating and drinking normally).
Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-071138",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
