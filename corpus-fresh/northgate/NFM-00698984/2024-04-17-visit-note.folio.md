---
folio: "0.1"
id: "01HVPPBQH09X6B0R323VTMFS3S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00698984"
effective: "2024-04-17T10:00:00-05:00"
recorded: "2024-04-17T13:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. BP 154/98, pulse 68, wt 174 lb.
Labs 4/15: eGFR 55, K 4.1, A1c 8.3%, LDL 97.
Started insulin glargine 10 units at bedtime today for A1c 8.3. Reviewed injection technique and low sugar symptoms.
Started empagliflozin 10 mg daily today, CKD + DM, cardiorenal benefit.
Pt agrees with plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-041735",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-041735",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-041735",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
