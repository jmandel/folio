---
folio: "0.1"
id: "01JCH489P0DMX4NJEP6CHF9HTG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00567532"
effective: "2024-11-12T15:25:00-06:00"
recorded: "2024-11-12T15:25:12-06:00"
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
    "lines_on_list": ["ML-40507", "ML-43439", "ML-32887"],
    "visit_id": "V-2024-111236"
  }
}
```
