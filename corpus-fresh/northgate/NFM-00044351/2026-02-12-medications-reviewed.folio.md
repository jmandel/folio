---
folio: "0.1"
id: "01KH9QKE5034JKJ25VW1Y9SGKQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2026-02-12T14:10:00-06:00"
recorded: "2026-02-12T14:10:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "lines_on_list": ["ML-18551", "ML-30459", "ML-12726", "ML-26743", "ML-45165"],
    "visit_id": "V-2026-021241"
  }
}
```
