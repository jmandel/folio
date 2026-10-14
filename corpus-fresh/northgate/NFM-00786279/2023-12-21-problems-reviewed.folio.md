---
folio: "0.1"
id: "01HJ70J830GA0AMNA1HPBNHVPH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00786279"
effective: "2023-12-21T14:20:00-06:00"
recorded: "2023-12-21T14:20:12-06:00"
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
    "lines_on_list": ["PL-17469", "PL-12362", "PL-13588"],
    "visit_id": "V-2023-122156"
  }
}
```
