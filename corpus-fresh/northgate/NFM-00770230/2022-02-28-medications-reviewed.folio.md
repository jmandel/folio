---
folio: "0.1"
id: "01FX0Y4790M5CQHZP1MFBPBY43"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770230"
effective: "2022-02-28T13:50:00-06:00"
recorded: "2022-02-28T13:50:12-06:00"
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
    "lines_on_list": ["ML-46307", "ML-23402", "ML-30509", "ML-47656", "ML-11204", "ML-20410"],
    "visit_id": "V-2022-022871"
  }
}
```
