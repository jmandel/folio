---
folio: "0.1"
id: "01KGN7VHS06XE57MZDECXTDY75"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00621637"
effective: "2026-02-04T15:10:00-06:00"
recorded: "2026-02-04T15:10:12-06:00"
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
    "lines_on_list": ["ML-20352", "ML-27478", "ML-11756", "ML-37595", "ML-32590", "ML-41802", "ML-27072"],
    "visit_id": "V-2026-020413"
  }
}
```
