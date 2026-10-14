---
folio: "0.1"
id: "01GPEMSRV0F99C7FFTP34TT4YQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00892695"
effective: "2023-01-10T08:00:00-06:00"
recorded: "2023-01-10T14:09:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

dapagliflozin: started 10 mg daily today (A1c 8.1)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011012",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-011012",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
