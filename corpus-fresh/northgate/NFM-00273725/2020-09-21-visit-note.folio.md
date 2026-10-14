---
folio: "0.1"
id: "01EJSEC7Z0ZQX1QZ06EK1ZM1RY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00273725"
effective: "2020-09-21T12:30:00-05:00"
recorded: "2020-09-21T18:01:00-05:00"
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

BP 144/91, pulse 64, wt 199 lb.

Labs from 9/19: eGFR 88, K 4.7, A1c 7.7%, LDL 89 mg/dL.

Records requested. Pt to schedule f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-092197",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-092197",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-092197",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-092197",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
