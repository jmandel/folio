---
folio: "0.1"
id: "01E0ENRSW0YTXK0BJS4H5JQQWR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00413130"
effective: "2020-02-06T15:45:00-06:00"
recorded: "2020-02-06T19:56:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

dapagliflozin: started 10 mg daily today (A1c 8.2)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-020615",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-020615",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-020615",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
