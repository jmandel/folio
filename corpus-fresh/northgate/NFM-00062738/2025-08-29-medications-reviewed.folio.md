---
folio: "0.1"
id: "01K3VT2YV0QH68JSWY81XPAE16"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00062738"
effective: "2025-08-29T16:00:00-05:00"
recorded: "2025-08-29T16:00:12-05:00"
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
    "lines_on_list": ["ML-21698", "ML-23115", "ML-18978", "ML-43088", "ML-49209"],
    "visit_id": "V-2025-082969"
  }
}
```
