---
folio: "0.1"
id: "01F8G66ES01FC96YQ0S2SFNJMZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00072209"
effective: "2021-06-18T13:30:00-05:00"
recorded: "2021-06-18T13:30:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "review": {
    "type": "list_reviewed",
    "list": "problems",
    "lines_on_list": ["PL-11150", "PL-15711", "PL-10952", "PL-10435", "PL-11094"],
    "visit_id": "V-2021-061877"
  }
}
```
