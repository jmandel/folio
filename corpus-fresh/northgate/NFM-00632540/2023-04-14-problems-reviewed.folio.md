---
folio: "0.1"
id: "01GY0KN4E0Y6YBJJ2442PWJM4A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00632540"
effective: "2023-04-14T14:25:00-05:00"
recorded: "2023-04-14T14:25:12-05:00"
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
    "lines_on_list": ["PL-13241", "PL-9276", "PL-14512", "PL-15672", "PL-9677"],
    "visit_id": "V-2023-041414"
  }
}
```
