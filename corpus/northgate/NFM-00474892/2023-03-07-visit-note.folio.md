---
folio: "0.1"
id: "01GTZ4CFM06EMYCX6Q13T5WR0Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00474892"
effective: "2023-03-07T14:30:00-06:00"
recorded: "2023-03-07T16:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic DKA, SGLT2 inhibitor-associated. Pt feels back to baseline, eating and drinking normally.
Empagliflozin: stopped today (euglycemic DKA). Empagliflozin adverse reaction: euglycemic diabetic ketoacidosis, entered on allergy list.
BP 132/78, pulse 65, wt 138 lb.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-030739",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-030739",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-030739",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
