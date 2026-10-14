---
folio: "0.1"
id: "01J85PW8F02PBPE5P48AP7RG66"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363203"
effective: "2024-09-19T11:15:00-05:00"
recorded: "2024-09-19T12:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u. Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated. Feels back to baseline, eating and drinking normally.
BP 138/78, pulse 80, wt 187 lb.
Dapagliflozin: stopped today (euglycemic DKA). Entered as adverse reaction: dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-091965",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-091965",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-091965",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
