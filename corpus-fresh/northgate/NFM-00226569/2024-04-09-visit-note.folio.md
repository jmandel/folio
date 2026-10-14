---
folio: "0.1"
id: "01HV1RTJ20X60A13V7QMNKNX2S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00226569"
effective: "2024-04-09T09:15:00-05:00"
recorded: "2024-04-09T10:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for euglycemic DKA, SGLT2 inhibitor-associated. Feels back to baseline, eating and drinking normally.

BP 125/78, pulse 79, wt 177 lb.

Dapagliflozin stopped today (euglycemic DKA), entered as adverse reaction: euglycemic diabetic ketoacidosis. Pt told not to restart it.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-040947",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-040947",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-040947",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
