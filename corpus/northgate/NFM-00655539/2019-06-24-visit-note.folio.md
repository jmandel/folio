---
folio: "0.1"
id: "01DE5ERWJ06DR0DND01B4TY1JJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00655539"
effective: "2019-06-24T12:45:00-05:00"
recorded: "2019-06-24T14:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.
BP 153/93, repeat 147/90. Pulse 73, wt 233 lb.
Labs from 6/20: eGFR 100, K 4.2, A1c 7.9%, LDL 114.
BP above goal on both readings. Will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-062487",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-062487",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-062487",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
