---
folio: "0.1"
id: "01GK2W0EB0QJMXCRTZX8TGZBNT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00396807"
effective: "2022-11-29T12:45:00-06:00"
recorded: "2022-11-29T17:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-112975",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-112975",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
