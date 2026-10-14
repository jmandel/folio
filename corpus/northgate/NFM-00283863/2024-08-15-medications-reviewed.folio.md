---
folio: "0.1"
id: "01J5BMJQT0AXYB1TC0MQ6RPXY4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00283863"
effective: "2024-08-15T13:25:00-05:00"
recorded: "2024-08-15T13:25:12-05:00"
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
    "list": "medications",
    "lines_on_list": ["ML-25010", "ML-22365", "ML-49046", "ML-19427"],
    "visit_id": "V-2024-081515"
  }
}
```
