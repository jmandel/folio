---
folio: "0.1"
id: "01FD0253X0J5B1297CZE1HVF7N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00084740"
effective: "2021-08-13T10:30:00-05:00"
recorded: "2021-08-13T10:30:12-05:00"
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
    "lines_on_list": ["ML-17270", "ML-40559", "ML-48740", "ML-26158", "ML-14312", "ML-42650", "ML-44758"],
    "visit_id": "V-2021-081319"
  }
}
```
