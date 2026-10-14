---
folio: "0.1"
id: "01HA7H7RY0S76JPMF8180K0JYD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00176898"
effective: "2023-09-13T08:30:00-05:00"
recorded: "2023-09-13T10:06:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 139/89, pulse 74, wt 187 lb.
Labs today: eGFR 44, K 4.6, A1c 7.3%, LDL 116 mg/dL.
Discussed diet and activity. No new complaints.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-091391",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-091391",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-091391",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
