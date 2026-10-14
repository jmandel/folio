---
folio: "0.1"
id: "01FDW93590XW46H16YMB26Y3W3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00315133"
effective: "2021-08-24T09:30:00-05:00"
recorded: "2021-08-24T09:30:12-05:00"
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
    "lines_on_list": ["PL-16302", "PL-19107", "PL-14211", "PL-15827"],
    "visit_id": "V-2021-082413"
  }
}
```
