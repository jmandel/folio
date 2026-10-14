---
folio: "0.1"
id: "01JQ7QSNN07A9JQVYNQR98385E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00312161"
effective: "2025-03-25T14:15:00-05:00"
recorded: "2025-03-25T17:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.

BP 152/92, repeat 144/90, pulse 87, wt 215 lb.
Labs today: eGFR 40, K 3.9, UACR 122 mg/g, A1c 8.3%, LDL 104 mg/dL.
Empagliflozin started 10 mg daily today (A1c 8.3, CKD). Losartan started 50 mg daily today (BP above goal).
Pt to drink fluids and report any problems. Recheck labs in a few weeks, RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-032551",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-032551",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-032551",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
