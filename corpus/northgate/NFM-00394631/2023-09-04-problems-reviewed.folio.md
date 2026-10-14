---
folio: "0.1"
id: "01H9GQXGQ0K3G5TWY1MP0T3BDX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00394631"
effective: "2023-09-04T13:40:00-05:00"
recorded: "2023-09-04T13:40:12-05:00"
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
    "lines_on_list": ["PL-9778", "PL-17162", "PL-11301"],
    "visit_id": "V-2023-090423"
  }
}
```
