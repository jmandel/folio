---
folio: "0.1"
id: "01KDNZN2D0Q5ZP0ZXA2G5DRXZV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00539751"
effective: "2025-12-29T13:10:00-06:00"
recorded: "2025-12-29T15:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

lisinopril: stopped today (dry cough)

lisinopril: stopped today (dry cough)

losartan: started 50 mg daily today (ACE inhibitor cough)

lisinopril intolerance: dry cough

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-122955",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-122955",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-122955",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
