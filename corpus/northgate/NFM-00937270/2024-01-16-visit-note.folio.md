---
folio: "0.1"
id: "01HMABFD000W93QJ9GWT5TZ3JF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937270"
effective: "2024-01-16T14:45:00-06:00"
recorded: "2024-01-16T18:00:00-06:00"
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

empagliflozin: started 10 mg daily today (A1c 8.1)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-011647",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-011647",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-011647",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-011647",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
