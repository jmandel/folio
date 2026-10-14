---
folio: "0.1"
id: "01HVPBEBV0NBQ5TT6MYPCQ4KFH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00698984"
effective: "2024-04-17T10:40:00-05:00"
recorded: "2024-04-17T10:40:12-05:00"
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
    "lines_on_list": ["ML-47904", "ML-25198", "ML-48900", "ML-13451", "ML-41858"],
    "visit_id": "V-2024-041735"
  }
}
```
