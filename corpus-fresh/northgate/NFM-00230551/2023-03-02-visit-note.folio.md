---
folio: "0.1"
id: "01GTHWAHB0ABFJP0Y8ZPC5WATM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230551"
effective: "2023-03-02T08:00:00-06:00"
recorded: "2023-03-02T13:21:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for euglycemic DKA, SGLT2 inhibitor-associated. Feels back to baseline, eating and drinking normally.
BP 133/78, pulse 81, wt 220 lb.
dapagliflozin: stopped today (euglycemic DKA). Entered as allergy list item: dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-030289",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-030289",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-030289",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
