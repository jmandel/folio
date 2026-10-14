---
folio: "0.1"
id: "01K11H64F0Y00NF08ZEFH0V6CJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00568295"
effective: "2025-07-25T08:50:00-05:00"
recorded: "2025-07-25T14:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u.
BP 137/83, pulse 78, wt 211 lb.
Labs 7/21: eGFR 46, K 4.4, UACR 97 mg/g, A1c 6.4%, LDL 137.
Lisinopril stopped today (dry cough); losartan started 50 mg daily today (ACE inhibitor cough).
Lisinopril intolerance: dry cough, added to allergy list.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-072591",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-072591",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-072591",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
