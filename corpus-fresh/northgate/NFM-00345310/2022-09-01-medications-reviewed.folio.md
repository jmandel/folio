---
folio: "0.1"
id: "01GBXESZQ0WAPG7DCRMNEXQ46A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00345310"
effective: "2022-09-01T16:20:00-05:00"
recorded: "2022-09-01T16:20:12-05:00"
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
    "lines_on_list": ["ML-21667", "ML-43825", "ML-21231", "ML-30000", "ML-20654"],
    "visit_id": "V-2022-090195"
  }
}
```
