---
folio: "0.1"
id: "01H6YEZ060B49S2FVX917VEMJ1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00945734"
effective: "2023-08-03T08:30:00-05:00"
recorded: "2023-08-03T14:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u. Feels back to baseline, eating and drinking normally.

Euglycemic DKA, SGLT2 inhibitor-associated. Empagliflozin stopped today and entered as adverse reaction (euglycemic diabetic ketoacidosis).

BP 145/78, repeat 141/75, pulse 68, wt 216 lb.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-080396",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-080396",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-080396",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
