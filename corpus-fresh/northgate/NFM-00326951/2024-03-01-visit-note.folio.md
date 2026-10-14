---
folio: "0.1"
id: "01HQY7TCR0XYJMTYNXVAESFE03"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00326951"
effective: "2024-03-01T12:30:00-06:00"
recorded: "2024-03-01T18:08:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u. Euglycemic DKA, SGLT2 inhibitor-associated. Feels back to baseline, eating and drinking normally.

Empagliflozin stopped today (euglycemic DKA), entered as adverse reaction: euglycemic diabetic ketoacidosis.

BP 140/78, repeat 136/74, pulse 64, wt 191 lb.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-030183",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-030183",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-030183",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
