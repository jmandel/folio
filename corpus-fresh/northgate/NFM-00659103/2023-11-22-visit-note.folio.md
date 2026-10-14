---
folio: "0.1"
id: "01HFWZB250GEDFJQ3Y9E0J6WCY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00659103"
effective: "2023-11-22T13:45:00-06:00"
recorded: "2023-11-22T20:15:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic DKA. Feels back to baseline, eating and drinking normally.
BP 130/78, pulse 71, wt 170 lb.
Dapagliflozin stopped today (euglycemic DKA, SGLT2 inhibitor-associated). Entered as adverse reaction: dapagliflozin adverse reaction, euglycemic diabetic ketoacidosis.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-112226",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-112226",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-112226",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
