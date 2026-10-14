---
folio: "0.1"
id: "01GX6Z1KR0P5MGHQ0F7GTXXH8P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785866"
effective: "2023-04-04T12:40:00-05:00"
recorded: "2023-04-04T15:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 145/88, pulse 82, wt 156 lb.

Labs 3/31: A1c 8.3%, eGFR 45, K 4.8, UACR 79 mg/g.

Insulin glargine started 10 units at bedtime today (A1c 8.3). Empagliflozin started 10 mg daily today (CKD + DM, cardiorenal benefit). Pt verbalized understanding. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-040456",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-040456",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-040456",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-040456",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
