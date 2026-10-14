---
folio: "0.1"
id: "01GHVKQMJ0WD5JC1FZMEM2EN1Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00007594"
effective: "2022-11-14T08:20:00-06:00"
recorded: "2022-11-14T11:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-111478",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
