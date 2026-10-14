---
folio: "0.1"
id: "01DHMXYNH0B5WJMBK3DR6CNV0D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2019-08-06T15:40:00-05:00"
recorded: "2019-08-06T21:19:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

insulin glargine: started 10 units at bedtime today (A1c 8.4)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-080666",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-080666",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-080666",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
