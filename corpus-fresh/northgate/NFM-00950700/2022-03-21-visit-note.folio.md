---
folio: "0.1"
id: "01FYQJYCB0DVEGZT7S1YQ5VDKN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00950700"
effective: "2022-03-21T14:15:00-05:00"
recorded: "2022-03-21T20:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 138/88, pulse 79, wt 145 lb.
Labs 3/15: eGFR 71, K 4, UACR 61 mg/g, A1c 6.8%.
Reviewed results with pt. Doing well, no complaints.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-032197",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-032197",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-032197",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
