---
folio: "0.1"
id: "01JWVKTSB0TX0CVD0KW92TH32H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00760692"
effective: "2025-06-03T08:00:00-05:00"
recorded: "2025-06-03T14:21:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic DKA, SGLT2 inhibitor-associated. Feels back to baseline, eating and drinking normally.
BP 136/78, pulse 86, wt 182 lb.
Dapagliflozin stopped today (euglycemic DKA) and entered as adverse reaction: euglycemic diabetic ketoacidosis.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-060324",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-060324",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-060324",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
