---
folio: "0.1"
id: "01FWHBQQQ09ZW86TCF9JGW5ERP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00520269"
effective: "2022-02-22T12:40:00-06:00"
recorded: "2022-02-22T12:40:12-06:00"
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
    "lines_on_list": ["PL-14628", "PL-9784", "PL-11109", "PL-18779"],
    "visit_id": "V-2022-022297"
  }
}
```
