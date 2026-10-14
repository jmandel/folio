---
folio: "0.1"
id: "01EKAXHA30EEB3ATXBXYSTDGZ7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00600773"
effective: "2020-09-28T10:50:00-05:00"
recorded: "2020-09-28T12:53:00-05:00"
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

BP 122/76, pulse 83, wt 142 lb.
Labs today: eGFR 62, K 4.7, A1c 7.9%, LDL 94 mg/dL.

Discussed results with pt. RTC for chronic care f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-092819",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-092819",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-092819",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
