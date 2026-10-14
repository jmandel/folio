---
folio: "0.1"
id: "01K0W01670W9KH163CHXW7TRW9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00338283"
effective: "2025-07-23T08:00:00-05:00"
recorded: "2025-07-23T10:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no new concerns.

BP 138/81, pulse 70, wt 205 lb.

Reviewed diet and activity. Labs to be updated.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-072329",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-072329",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
