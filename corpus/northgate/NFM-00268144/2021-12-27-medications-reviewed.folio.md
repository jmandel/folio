---
folio: "0.1"
id: "01FQYQ2Y90M8M1M5D4TH208XZW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00268144"
effective: "2021-12-27T13:50:00-06:00"
recorded: "2021-12-27T13:50:12-06:00"
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
    "lines_on_list": ["ML-24167", "ML-48420", "ML-44660", "ML-20134", "ML-19291", "ML-47477"],
    "visit_id": "V-2021-122718"
  }
}
```
