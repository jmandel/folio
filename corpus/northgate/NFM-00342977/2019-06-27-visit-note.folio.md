---
folio: "0.1"
id: "01DECT0BF056HXBFF0S511PMGE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342977"
effective: "2019-06-27T09:10:00-05:00"
recorded: "2019-06-27T10:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History of HTN and DM2 per pt.
BP 131/77, pulse 62, wt 174 lb.
Labs from 6/22: eGFR 78, K 4.7, UACR 8 mg/g, A1c 7.3%, LDL 146 mg/dL.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-062733",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-062733",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-062733",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
