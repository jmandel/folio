---
folio: "0.1"
id: "01GYGE1KD0KH9RH17V43HYW0QC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00850967"
effective: "2023-04-20T12:50:00-05:00"
recorded: "2023-04-20T17:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.

empagliflozin: started 10 mg daily today (A1c 8.6)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-042057",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-042057",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-042057",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-042057",
    "rank": 3,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
