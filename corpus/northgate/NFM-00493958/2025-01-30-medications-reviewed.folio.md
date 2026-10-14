---
folio: "0.1"
id: "01JJW92DM0WFNR7EHKVSR63K8F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493958"
effective: "2025-01-30T12:55:00-06:00"
recorded: "2025-01-30T12:55:12-06:00"
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
    "lines_on_list": ["ML-31274", "ML-44931", "ML-27071", "ML-48925", "ML-25906", "ML-14726", "ML-36044"],
    "visit_id": "V-2025-013071"
  }
}
```
