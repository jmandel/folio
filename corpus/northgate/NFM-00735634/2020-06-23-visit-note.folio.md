---
folio: "0.1"
id: "01EBHHCXY0MCXRP5HBNPCZ40X1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2020-06-23T12:16:00-05:00"
recorded: "2020-06-23T16:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: sick, vomiting.

metformin: held today (vomiting, poor oral intake); review 2020-06-30

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-062397",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
