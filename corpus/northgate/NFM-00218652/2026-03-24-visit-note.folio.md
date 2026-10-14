---
folio: "0.1"
id: "01KMGTF1A05ZES9Q3Q76JDXSW6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00218652"
effective: "2026-03-24T12:40:00-05:00"
recorded: "2026-03-24T16:02:00-05:00"
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

lisinopril: stopped today (dry cough)

losartan: started 50 mg daily today (ACE inhibitor cough)

lisinopril intolerance: dry cough

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-032466",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-032466",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-032466",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-032466",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2026-032466",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
