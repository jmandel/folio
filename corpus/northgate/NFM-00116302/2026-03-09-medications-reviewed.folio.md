---
folio: "0.1"
id: "01KKA58AZ06R8Z4MFPQB43H4KQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00116302"
effective: "2026-03-09T15:40:00-05:00"
recorded: "2026-03-09T15:40:12-05:00"
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
    "lines_on_list": ["ML-44070", "ML-10927", "ML-35649", "ML-28312", "ML-26375"],
    "visit_id": "V-2026-030952"
  }
}
```
