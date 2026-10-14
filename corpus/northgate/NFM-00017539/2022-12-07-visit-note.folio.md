---
folio: "0.1"
id: "01GKPQ6ZJ01W0MBS6GADSKWKG7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00017539"
effective: "2022-12-07T08:20:00-06:00"
recorded: "2022-12-07T10:38:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care.
BP 136/73, pulse 87, wt 192 lb.
Labs 12/4: eGFR 74, K 4.4.
Reviewed history with pt, records to follow.
RTC for annual exam.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-120763",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-120763",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
