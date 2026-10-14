---
folio: "0.1"
id: "01H5QEMPY0SAWXC2W6MDGC8WFP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00263380"
effective: "2023-07-19T08:30:00-05:00"
recorded: "2023-07-19T11:10:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for euglycemic DKA, SGLT2 inhibitor-associated. Feels back to baseline.

BP 146/78, repeat 141/78, pulse 82, wt 165 lb.

Empagliflozin stopped today (euglycemic DKA), entered as adverse reaction: euglycemic diabetic ketoacidosis.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-071946",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-071946",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-071946",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
