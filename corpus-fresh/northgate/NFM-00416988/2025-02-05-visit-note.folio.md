---
folio: "0.1"
id: "01JKC3R1J0EQE7DH28RZN6XRXV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2025-02-05T12:45:00-06:00"
recorded: "2025-02-05T16:30:00-06:00"
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
BP 145/78, repeat 143/77, pulse 74, wt 204 lb.
Dapagliflozin: stopped today (euglycemic DKA). Dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis, entered in the allergy list.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-020594",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-020594",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-020594",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
