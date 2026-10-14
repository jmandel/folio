---
folio: "0.1"
id: "01JRTS39N00MMTMV3S34CNJ65W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00226569"
effective: "2025-04-14T11:45:00-05:00"
recorded: "2025-04-14T13:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 125/73, pulse 76, wt 174 lb.

Labs today: eGFR 41, K 4.7, UACR 102 mg/g, A1c 6.7%, LDL 124.

A1c at goal. UACR higher than last, will keep watching.

RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-041453",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-041453",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-041453",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
