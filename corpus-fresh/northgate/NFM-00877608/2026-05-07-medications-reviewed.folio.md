---
folio: "0.1"
id: "01KR1YPJD06YPG9T40891J2VQY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00877608"
effective: "2026-05-07T14:30:00-05:00"
recorded: "2026-05-07T14:30:12-05:00"
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
    "lines_on_list": ["ML-10236", "ML-26487", "ML-38455", "ML-25934", "ML-17334", "ML-47608", "ML-11153"],
    "visit_id": "V-2026-050789"
  }
}
```
