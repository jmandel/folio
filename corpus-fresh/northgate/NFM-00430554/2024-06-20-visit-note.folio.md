---
folio: "0.1"
id: "01J0VC0WB001E472P0W376SF1H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00430554"
effective: "2024-06-20T09:45:00-05:00"
recorded: "2024-06-20T12:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u. Feels back to baseline, eating and drinking normally.

BP 139/78, pulse 84, wt 192 lb.

Euglycemic DKA, SGLT2 inhibitor-associated. Empagliflozin stopped today, entered as adverse reaction: euglycemic diabetic ketoacidosis.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-062083",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-062083",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-062083",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
