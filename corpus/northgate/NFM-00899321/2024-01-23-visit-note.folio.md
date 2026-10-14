---
folio: "0.1"
id: "01HMVQRXE0ANV5NJKV99J351TQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00899321"
effective: "2024-01-23T09:40:00-06:00"
recorded: "2024-01-23T12:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Patient ran out of losartan about 3 weeks ago and has not been taking it.
BP 136/84, pulse 88, wt 213 lb.
eGFR 77, K 4.1 today.
Discussed importance of not running out. Will recheck BP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-012375",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-012375",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
