---
folio: "0.1"
id: "01J7YEAVF01GN1TBX9R2N7MQDW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00727793"
effective: "2024-09-16T13:45:00-05:00"
recorded: "2024-09-16T17:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u.

empagliflozin: stopped today (euglycemic DKA)

empagliflozin adverse reaction: euglycemic diabetic ketoacidosis

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-091633",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-091633",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-091633",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
