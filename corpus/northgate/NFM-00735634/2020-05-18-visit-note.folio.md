---
folio: "0.1"
id: "01E8M9F320T2XGM5TFRP1VAEVT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2020-05-18T08:30:00-05:00"
recorded: "2020-05-18T11:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

losartan: dose changed to 100 mg daily today (BP above goal)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-051898",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-051898",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-051898",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
