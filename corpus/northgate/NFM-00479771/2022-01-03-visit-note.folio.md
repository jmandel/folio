---
folio: "0.1"
id: "01FRHD2XV03Y6SH6VR75XVS0G8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00479771"
effective: "2022-01-03T13:50:00-06:00"
recorded: "2022-01-03T20:01:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records and history reviewed with pt.

BP 132/82, pulse 83, wt 219 lb.
Labs from 12/28/21: eGFR 80, K 4.5, LDL 71 mg/dL.
Questions answered. RTC to review at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-010337",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-010337",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
