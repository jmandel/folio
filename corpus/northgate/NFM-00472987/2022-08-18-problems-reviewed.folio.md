---
folio: "0.1"
id: "01GASD7XQ058YFPJH8AFFPWAJG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00472987"
effective: "2022-08-18T16:20:00-05:00"
recorded: "2022-08-18T16:20:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "lines_on_list": ["PL-16814", "PL-13565", "PL-17983", "PL-11342"],
    "visit_id": "V-2022-081839"
  }
}
```
