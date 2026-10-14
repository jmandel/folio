---
folio: "0.1"
id: "01GPNT1B400FC55BS8MNZM3KGV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00334426"
effective: "2023-01-13T08:55:00-06:00"
recorded: "2023-01-13T08:55:12-06:00"
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
    "lines_on_list": ["PL-19981", "PL-17197", "PL-15537"],
    "visit_id": "V-2023-011319"
  }
}
```
