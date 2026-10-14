---
folio: "0.1"
id: "01FR3JQD90PM2HG4H3QG3F5KGC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00996346"
effective: "2021-12-29T11:10:00-06:00"
recorded: "2021-12-29T11:10:12-06:00"
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
    "lines_on_list": ["PL-19951", "PL-19135", "PL-9181"],
    "visit_id": "V-2021-122987"
  }
}
```
