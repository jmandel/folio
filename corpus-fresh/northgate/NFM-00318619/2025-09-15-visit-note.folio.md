---
folio: "0.1"
id: "01K57ETMJ0MKBKJH8EYC9T7501"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00318619"
effective: "2025-09-15T09:45:00-05:00"
recorded: "2025-09-15T14:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels fine, no new symptoms.
BP 125/71, pulse 82, wt 217 lb.
Labs 9/11: eGFR 48, K 4.2, UACR 367 mg/g, A1c 7.2%, LDL 81 mg/dL.
Reviewed with pt, no changes today.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-091564",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-091564",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-091564",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
