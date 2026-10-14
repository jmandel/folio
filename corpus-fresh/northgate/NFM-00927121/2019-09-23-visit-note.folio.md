---
folio: "0.1"
id: "01DNFDS7S06SCSAP5XC81WGWFK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927121"
effective: "2019-09-23T09:10:00-05:00"
recorded: "2019-09-23T11:03:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt, problem list built from what pt reports.
BP 132/75, pulse 62, wt 222 lb.
Feels well overall, no new complaints today.
Records requested from prior office.
RTC for f/u after labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-092338",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-092338",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-092338",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2019-092338",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
