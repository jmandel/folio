---
folio: "0.1"
id: "01H15NB5A03JY7RA8Q395CJ2WW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922389"
effective: "2023-05-23T14:10:00-05:00"
recorded: "2023-05-23T20:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. A1c up, pt feels well otherwise.

BP 138/81, pulse 83, wt 188 lb. Labs today: eGFR 50, K 4.3, A1c 8.1%.

Insulin glargine: started 10 units at bedtime today (A1c 8.1). Pen use and low sugar symptoms reviewed.

RTC 3 mo, bring glucose log.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-052379",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-052379",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-052379",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-052379",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
