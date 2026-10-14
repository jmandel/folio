---
folio: "0.1"
id: "01FHBWCD90TCPF2JQGA25339VW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00155300"
effective: "2021-10-06T13:33:00-05:00"
recorded: "2021-10-06T17:43:00-05:00"
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
Eating and drinking normally.
Metformin resumed today.
Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-100632",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
