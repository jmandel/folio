---
folio: "0.1"
id: "01KJ8EMYS0WJ1THDC9JK00F7EZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00993518"
effective: "2026-02-24T12:30:00-06:00"
recorded: "2026-02-24T12:30:12-06:00"
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
    "lines_on_list": ["ML-34890", "ML-30478", "ML-33036", "ML-47238", "ML-12378", "ML-44305", "ML-43543", "ML-22387"],
    "visit_id": "V-2026-022411"
  }
}
```
