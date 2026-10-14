---
folio: "0.1"
id: "01FJNF8XA0EHVJA3SH1216D78C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342977"
effective: "2021-10-22T15:40:00-05:00"
recorded: "2021-10-22T21:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 127/81, pulse 86, wt 175 lb.
Labs 10/19: eGFR 75, K 4, A1c 8.4%.
A1c up, so started dulaglutide 0.5 mg weekly today. Injection technique reviewed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-102275",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-102275",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
