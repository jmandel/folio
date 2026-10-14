---
folio: "0.1"
id: "01HCDT5Q30HJRNKTNN1AF1VM36"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00144865"
effective: "2023-10-10T11:00:00-05:00"
recorded: "2023-10-10T17:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 131/80, pulse 72, wt 210 lb.
Labs 10/8: eGFR 47, K 4.7, A1c 7.5%, LDL 89.
BP better. Pt doing well, no new complaints.
RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-101054",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-101054",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-101054",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
