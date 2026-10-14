---
folio: "0.1"
id: "01JT9KBMD02V5HZEYFX3GP7RDA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00713158"
effective: "2025-05-02T15:50:00-05:00"
recorded: "2025-05-02T17:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well, no new complaints.
BP 119/77, pulse 64, wt 200 lb.
Labs today: eGFR 44, K 4.2, A1c 7.1%, LDL 99 mg/dL.
A1c improved. Pt pleased.
RTC 4-5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-050247",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-050247",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-050247",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
