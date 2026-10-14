---
folio: "0.1"
id: "01ECWV3JS016ZNNNWV20F6J2SG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00994489"
effective: "2020-07-10T09:40:00-05:00"
recorded: "2020-07-10T12:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 131/75, pulse 63, wt 218 lb.
eGFR 74 today, K 4.3.
Problem list started today.
RTC to be scheduled for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-071091",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-071091",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
