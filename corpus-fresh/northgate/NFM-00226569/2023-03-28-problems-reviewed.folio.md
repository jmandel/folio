---
folio: "0.1"
id: "01GWMCW9Z0J7S1HAQRRXED1QW6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00226569"
effective: "2023-03-28T10:20:00-05:00"
recorded: "2023-03-28T10:20:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "lines_on_list": ["PL-16184", "PL-17987", "PL-12218", "PL-17669", "PL-14472"],
    "visit_id": "V-2023-032851"
  }
}
```
