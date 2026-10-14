---
folio: "0.1"
id: "01KTAC7JR0YGK2G7XRCSBC3FNJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00007594"
effective: "2026-06-04T15:30:00-05:00"
recorded: "2026-06-04T17:32:00-05:00"
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
    "visit_id": "V-2026-060417",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
