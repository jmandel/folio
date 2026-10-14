---
folio: "0.1"
id: "01HDPCEGP0GBRB0Q0PHG4CNP10"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00040235"
effective: "2023-10-26T08:30:00-05:00"
recorded: "2023-10-26T11:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u. Feels back to baseline, eating and drinking normally.

BP 147/78, repeat 139/75. Pulse 85, wt 173 lb.

Euglycemic DKA, SGLT2 inhibitor-associated. Empagliflozin stopped today and entered as adverse reaction (euglycemic diabetic ketoacidosis).

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-102648",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-102648",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-102648",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
