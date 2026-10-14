---
folio: "0.1"
id: "01GH1Y7HT0KRCT2PAESMFCHPND"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2022-11-04T13:25:00-05:00"
recorded: "2022-11-04T13:25:12-05:00"
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
    "lines_on_list": ["PL-19603", "PL-19988", "PL-19074", "PL-12808"],
    "visit_id": "V-2022-110421"
  }
}
```
