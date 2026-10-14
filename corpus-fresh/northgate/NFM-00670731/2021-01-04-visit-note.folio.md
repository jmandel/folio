---
folio: "0.1"
id: "01EV7Q0TX0DJ670TEZSW6637D8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00670731"
effective: "2021-01-04T13:00:00-06:00"
recorded: "2021-01-04T16:07:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no new complaints.
BP 132/75, pulse 76, wt 222 lb.
1/1 labs: eGFR 63, K 4.5, A1c 6.1%.
Reviewed results with pt. Diet and activity encouraged.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-010464",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-010464",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
