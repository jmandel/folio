---
folio: "0.1"
id: "01F7YEJCS0YB68GP6YNGZD2PKQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00503403"
effective: "2021-06-11T16:10:00-05:00"
recorded: "2021-06-11T16:10:12-05:00"
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
    "lines_on_list": ["PL-19412", "PL-10315", "PL-10316", "PL-11506", "PL-18981"],
    "visit_id": "V-2021-061196"
  }
}
```
