---
folio: "0.1"
id: "01ECNK6AA0VV4ANN5NTA454Q3J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2020-07-07T13:27:00-05:00"
recorded: "2020-07-07T16:34:00-05:00"
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
    "visit_id": "V-2020-070771",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
