---
folio: "0.1"
id: "01K842QKM02HQ7WJ88DWDXBRYK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00721565"
effective: "2025-10-21T10:20:00-05:00"
recorded: "2025-10-21T14:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 147/79, repeat 141/79, pulse 62, wt 213 lb.
Labs today: eGFR 34, K 4.2, UACR 111 mg/g, A1c 7.4%, LDL 123.
BP above goal, amlodipine started 5 mg daily today.
Pt to watch for ankle swelling. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-102153",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-102153",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-102153",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-102153",
    "rank": 3,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
