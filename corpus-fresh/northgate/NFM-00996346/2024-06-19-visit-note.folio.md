---
folio: "0.1"
id: "01J0S7RE004VE19TZ60CZ709TE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00996346"
effective: "2024-06-19T12:20:00-05:00"
recorded: "2024-06-19T16:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 147/91, repeat 144/89, pulse 62, wt 196 lb.

Labs 6/13: A1c 8.1%, eGFR 59, K 4.2.

A1c 8.1 so started dulaglutide 0.5 mg weekly today. BP elevated, will recheck at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-061994",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-061994",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
