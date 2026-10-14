---
folio: "0.1"
id: "01JAV6DFW08AQDHTQXKYCGW7ST"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00529403"
effective: "2024-10-22T13:00:00-05:00"
recorded: "2024-10-22T17:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 138/82, pulse 85, wt 174 lb.
Labs today: eGFR 35, K 4.6, UACR 162 mg/g, A1c 8.6%, LDL 151 mg/dL.
Started dapagliflozin 10 mg daily today (CKD + DM, cardiorenal benefit).
Started insulin glargine 10 units at bedtime today for A1c 8.6.
Reviewed both with pt. RTC to recheck labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-102218",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-102218",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
