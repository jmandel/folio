---
folio: "0.1"
id: "01HJ7H6Q50RKE7EVH9DNCW8X7J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00786279"
effective: "2023-12-21T13:40:00-06:00"
recorded: "2023-12-21T19:11:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. BP 145/84, repeat 138/80, pulse 62, wt 203 lb.
Labs 12/15: eGFR 37, K 4.9, A1c 8.2%, LDL 97 mg/dL.
Metformin dose changed to 500 mg twice daily today (eGFR 40).
Empagliflozin started 10 mg daily today (A1c 8.2, CKD).
Pt agrees with plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-122156",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-122156",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-122156",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-122156",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
