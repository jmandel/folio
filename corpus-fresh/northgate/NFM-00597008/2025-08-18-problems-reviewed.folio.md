---
folio: "0.1"
id: "01K2Z2HX90K2AA11XH61D1M320"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00597008"
effective: "2025-08-18T12:10:00-05:00"
recorded: "2025-08-18T12:10:12-05:00"
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
    "lines_on_list": ["PL-13635", "PL-16184", "PL-12985", "PL-11989", "PL-18093"],
    "visit_id": "V-2025-081824"
  }
}
```
