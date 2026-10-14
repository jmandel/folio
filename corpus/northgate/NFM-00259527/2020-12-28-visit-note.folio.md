---
folio: "0.1"
id: "01ETNV8Y50Z801324G320STSC6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00259527"
effective: "2020-12-28T14:20:00-06:00"
recorded: "2020-12-28T17:35:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. No complaints.

BP 151/93, repeat 149/89, pulse 73, wt 233 lb. Today eGFR 69, K 4.3, A1c 6.8%, LDL 78 mg/dL.

BP above goal, chlorthalidone: started 12.5 mg daily today. Will recheck BMP at next visit.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-122879",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-122879",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-122879",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
