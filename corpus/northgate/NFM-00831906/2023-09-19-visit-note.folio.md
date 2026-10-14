---
folio: "0.1"
id: "01HAQXYHM08JKJJ3EVTSZ43KZ7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00831906"
effective: "2023-09-19T14:00:00-05:00"
recorded: "2023-09-19T18:56:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.
BP 147/93, pulse 63, wt 131 lb.
Labs 9/16: eGFR 52, K 4.5, A1c 7.4%, LDL 120.
Dapagliflozin started 10 mg daily today (CKD + DM, cardiorenal benefit).
Reviewed plan with pt, questions answered.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-091957",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-091957",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
