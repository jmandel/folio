---
folio: "0.1"
id: "01FH8P2VC0W1EFQW8EADY9QPD4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2021-10-05T11:55:00-05:00"
recorded: "2021-10-05T11:55:12-05:00"
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
    "lines_on_list": ["ML-11050", "ML-12742", "ML-47783", "ML-49974", "ML-15323"],
    "visit_id": "V-2021-100562"
  }
}
```
