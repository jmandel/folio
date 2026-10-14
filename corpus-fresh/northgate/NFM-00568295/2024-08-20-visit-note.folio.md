---
folio: "0.1"
id: "01J5RMJ4N0HAAQGHCNYA5J6T25"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00568295"
effective: "2024-08-20T08:40:00-05:00"
recorded: "2024-08-20T14:35:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well, no new complaints.
BP 139/84, pulse 65, wt 216 lb.
Labs today: eGFR 45, K 4.7, UACR 110 mg/g, A1c 6.6%, LDL 162.
Empagliflozin started 10 mg daily today for CKD + DM, cardiorenal benefit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-082097",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-082097",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-082097",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
