---
folio: "0.1"
id: "01EGVBP0Z07RMVT6EMDJNZ539T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00560147"
effective: "2020-08-28T10:20:00-05:00"
recorded: "2020-08-28T15:21:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN since 2010 per pt.
BP 136/88, pulse 84, wt 186 lb.
Labs 8/23: eGFR 82, K 4.4.
Reviewed history and goals. Home BP log encouraged.
RTC for chronic care visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-082879",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-082879",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
