---
folio: "0.1"
id: "01HP024YW0TNXAXG0296QVS1HH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00127681"
effective: "2024-02-06T09:50:00-06:00"
recorded: "2024-02-06T14:36:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-020679",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-020679",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-020679",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
