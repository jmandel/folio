---
folio: "0.1"
id: "01HNY7V3V0W7EAXVEY7JMVW7EK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00453430"
effective: "2024-02-05T15:10:00-06:00"
recorded: "2024-02-05T21:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

metformin: dose changed to 1000 mg twice daily today (A1c 8.5)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-020534",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-020534",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-020534",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-020534",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
