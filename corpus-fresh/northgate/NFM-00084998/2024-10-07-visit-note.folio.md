---
folio: "0.1"
id: "01J9M5F2300048HEYPCMEPJ3X5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00084998"
effective: "2024-10-07T09:00:00-05:00"
recorded: "2024-10-07T13:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx of HTN, DM2, HLD, HFrEF and knee OA per pt.
BP 123/77, pulse 71, wt 199 lb. Labs 10/1: eGFR 39, K 5, A1c 8.6%, LDL 62.
Metformin changed to 500 mg BID today (eGFR 42).
Dapagliflozin started 10 mg daily today (A1c 8.6, CKD).
Referred to nephrology. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-100787",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-100787",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-100787",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-100787",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
