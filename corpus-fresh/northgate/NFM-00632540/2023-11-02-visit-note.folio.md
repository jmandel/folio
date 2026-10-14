---
folio: "0.1"
id: "01HE8MS820W9KF5NBZ8YYJC1ZA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00632540"
effective: "2023-11-02T11:30:00-05:00"
recorded: "2023-11-02T13:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for euglycemic DKA, felt to be SGLT2 inhibitor-associated. Feels back to baseline, eating and drinking normally.

BP 120/78, pulse 77, wt 238 lb.

Dapagliflozin stopped today for euglycemic DKA, and entered as an adverse reaction.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-110222",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-110222",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-110222",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
