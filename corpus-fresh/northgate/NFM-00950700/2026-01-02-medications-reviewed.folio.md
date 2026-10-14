---
folio: "0.1"
id: "01KE0B12H0Z44GSTKS464JEVM2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00950700"
effective: "2026-01-02T15:50:00-06:00"
recorded: "2026-01-02T15:50:12-06:00"
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
    "lines_on_list": ["ML-38730", "ML-24508", "ML-26789", "ML-17274", "ML-21463", "ML-24003"],
    "visit_id": "V-2026-010244"
  }
}
```
