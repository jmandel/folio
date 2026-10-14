---
folio: "0.1"
id: "01DBBSEMZ0VYV3RMPVNRJD15PH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821886"
effective: "2019-05-20T12:15:00-05:00"
recorded: "2019-05-20T18:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 130/74, pulse 85, wt 185 lb.
Labs today: eGFR 85, K 4.6, A1c 8.8%, LDL 96.
A1c 8.8, so metformin up to 1000 mg BID today.
RTC 3 mo with repeat A1c.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-052048",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-052048",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-052048",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2019-052048",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
