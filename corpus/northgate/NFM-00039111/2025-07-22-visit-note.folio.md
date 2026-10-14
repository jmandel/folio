---
folio: "0.1"
id: "01K0SSFG402AG9JJ5NQ5ZKPFNQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00039111"
effective: "2025-07-22T09:50:00-05:00"
recorded: "2025-07-22T14:24:00-05:00"
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

dulaglutide: started 0.5 mg weekly today (A1c 8.1)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-072294",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-072294",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-072294",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-072294",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
