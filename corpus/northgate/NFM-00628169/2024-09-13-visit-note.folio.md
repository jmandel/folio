---
folio: "0.1"
id: "01J7PBXT30MBM1JK46DN9K12PH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00628169"
effective: "2024-09-13T09:30:00-05:00"
recorded: "2024-09-13T13:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

insulin glargine: dose changed to 14 units at bedtime today (A1c 8.1)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-091315",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-091315",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-091315",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-091315",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
