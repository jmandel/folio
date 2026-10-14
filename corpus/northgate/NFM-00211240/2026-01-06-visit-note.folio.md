---
folio: "0.1"
id: "01KEABQRS0QMD7C0X5A96DQHSR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00211240"
effective: "2026-01-06T09:10:00-06:00"
recorded: "2026-01-06T13:15:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-010682",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-010682",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-010682",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-010682",
    "rank": 3,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2026-010682",
    "rank": 4,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
