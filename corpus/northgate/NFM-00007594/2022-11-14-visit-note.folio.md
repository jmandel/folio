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
F/u. Pt doing well, no complaints.
BP 136/79, pulse 68, wt 213 lb.
eGFR 72 and K 4.2 today.
Labs reviewed with pt.
RTC 6 mo.

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
