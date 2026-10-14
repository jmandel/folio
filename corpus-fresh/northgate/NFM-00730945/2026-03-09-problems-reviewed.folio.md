---
folio: "0.1"
id: "01KK9H7F50RYSV3XS5BPD4YGG0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00730945"
effective: "2026-03-09T09:50:00-05:00"
recorded: "2026-03-09T09:50:12-05:00"
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
    "list": "problems",
    "lines_on_list": ["PL-13902", "PL-11542", "PL-12192"],
    "visit_id": "V-2026-030931"
  }
}
```
