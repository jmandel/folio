---
folio: "0.1"
id: "01ET3G4FP0X3TEHNFFHY5WWH5Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00234334"
effective: "2020-12-21T12:45:00-06:00"
recorded: "2020-12-21T14:34:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records and labs from 12/19 reviewed.
BP 150/86, pulse 67, wt 185 lb.
eGFR 69, K 4.1, A1c 7.6%, LDL 66 mg/dL (all 12/19). UACR 430 mg/g (12/19).
BP above goal today. Will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-122124",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-122124",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-122124",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
