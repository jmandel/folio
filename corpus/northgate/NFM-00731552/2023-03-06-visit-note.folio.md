---
folio: "0.1"
id: "01GTW1VD601141CEZJW86T56QA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2023-03-06T09:35:00-06:00"
recorded: "2023-03-06T12:10:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. eGFR 49 and A1c 7.9% today.
BP 134/82, pulse 76, wt 190 lb.
Empagliflozin started 10 mg daily today (CKD + DM, cardiorenal benefit).
Reviewed hydration and genital hygiene. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-030617",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-030617",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-030617",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
