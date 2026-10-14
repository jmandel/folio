---
folio: "0.1"
id: "01J8V1ZCN03WHNG4T357H8MGC9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00846917"
effective: "2024-09-27T15:10:00-05:00"
recorded: "2024-09-27T19:55:00-05:00"
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

empagliflozin: started 10 mg daily today (A1c 8.6)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-092785",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-092785",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-092785",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
