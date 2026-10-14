---
folio: "0.1"
id: "01J53SYQ6039PJY4416BJHJZH9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00713158"
effective: "2024-08-12T12:25:00-05:00"
recorded: "2024-08-12T12:25:12-05:00"
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
    "lines_on_list": ["PL-19048", "PL-19201", "PL-9150"],
    "visit_id": "V-2024-081222"
  }
}
```
