---
folio: "0.1"
id: "01JV384950J5B8E5NHHG97ETGY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00712523"
effective: "2025-05-12T12:45:00-05:00"
recorded: "2025-05-12T16:59:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 149/93, repeat 141/90, pulse 73, wt 174 lb.
eGFR 41, K 4.7, UACR 68 mg/g today.
Insulin glargine: started 10 units at bedtime today (A1c 9.3).
Losartan: started 50 mg daily today (BP above goal).
Taught pt pen use. RTC 4 wks.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-051279",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-051279",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-051279",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-051279",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
