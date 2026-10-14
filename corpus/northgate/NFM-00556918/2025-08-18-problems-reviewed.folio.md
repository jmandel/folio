---
folio: "0.1"
id: "01K2Z9DMH0DYVKKS7RZ1KGH6QE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00556918"
effective: "2025-08-18T14:10:00-05:00"
recorded: "2025-08-18T14:10:12-05:00"
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
    "lines_on_list": ["PL-16011", "PL-10141", "PL-10353", "PL-14474", "PL-13980"],
    "visit_id": "V-2025-081857"
  }
}
```
