---
folio: "0.1"
id: "01FC665RB0S1NE5CMFAXEH8BTX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2021-08-03T09:20:00-05:00"
recorded: "2021-08-03T09:20:12-05:00"
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
    "list": "medications",
    "lines_on_list": ["ML-14340", "ML-45006", "ML-25429", "ML-41882", "ML-11813"],
    "visit_id": "V-2021-080319"
  }
}
```
