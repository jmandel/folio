---
folio: "0.1"
id: "01EH5NV6X0V0B10G6W9NH9YRRG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00552486"
effective: "2020-09-01T12:00:00-05:00"
recorded: "2020-09-01T15:31:00-05:00"
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
BP 135/75, pulse 70, wt 196 lb.
Labs today: eGFR 54, K 4.7, UACR 10 mg/g, A1c 7.2%, LDL 127 mg/dL.
Reviewed results with pt. Records requested from prior office.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-090155",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-090155",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-090155",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
