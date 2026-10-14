---
folio: "0.1"
id: "01FNV85830GZRJ9FN3XK76053R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00017276"
effective: "2021-12-01T09:00:00-06:00"
recorded: "2021-12-01T09:00:12-06:00"
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
    "lines_on_list": ["PL-19989", "PL-19192", "PL-17846", "PL-12095", "PL-17217"],
    "visit_id": "V-2021-120124"
  }
}
```
