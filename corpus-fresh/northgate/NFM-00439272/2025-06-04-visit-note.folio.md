---
folio: "0.1"
id: "01JWXY1NE03V92YYAE6255XVJ0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00439272"
effective: "2025-06-04T09:45:00-05:00"
recorded: "2025-06-04T11:58:00-05:00"
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

BP 138/78, pulse 73, wt 182 lb.

Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated. Empagliflozin stopped today (euglycemic DKA), and empagliflozin adverse reaction: euglycemic diabetic ketoacidosis entered in the allergy list.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-060453",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-060453",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-060453",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
