---
folio: "0.1"
id: "01HB785690HSS1MS6H5WCMHGVQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351015"
effective: "2023-09-25T13:15:00-05:00"
recorded: "2023-09-25T17:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic DKA. Feels back to baseline, eating and drinking normally.
BP 135/78, pulse 85, wt 149 lb.
Empagliflozin stopped today, entered as adverse reaction (euglycemic diabetic ketoacidosis).

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 2 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092594",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092594",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-092594",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
