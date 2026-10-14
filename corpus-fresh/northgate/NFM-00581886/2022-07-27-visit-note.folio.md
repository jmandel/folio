---
folio: "0.1"
id: "01G9134AE0S2K45PJB0VTTQE5K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00581886"
effective: "2022-07-27T13:20:00-05:00"
recorded: "2022-07-27T19:26:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt doing OK, no new complaints.

BP 133/84, pulse 84, wt 189 lb.

Reviewed plan with pt, no changes today.

RTC as scheduled.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-072714",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-072714",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
