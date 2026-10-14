---
folio: "0.1"
id: "01HFD7P3Z0X9V8YHPBHPKMR92V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00995828"
effective: "2023-11-16T13:40:00-06:00"
recorded: "2023-11-16T17:33:00-06:00"
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

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-111671",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-111671",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
