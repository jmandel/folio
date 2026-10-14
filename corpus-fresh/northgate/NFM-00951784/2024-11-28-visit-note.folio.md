---
folio: "0.1"
id: "01JDTMX0V0V6B7F8D5D152SK7G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00951784"
effective: "2024-11-28T15:30:00-06:00"
recorded: "2024-11-28T18:25:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, feels back to baseline.
BP 124/78, pulse 67, wt 112 lb.
Euglycemic DKA, SGLT2 inhibitor-associated.
Dapagliflozin stopped today, entered as adverse reaction: euglycemic diabetic ketoacidosis.
Pt voiced understanding.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-112878",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-112878",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-112878",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
