---
folio: "0.1"
id: "01JDMK1D70TYXBC06QCA5M2KT8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00212854"
effective: "2024-11-26T08:15:00-06:00"
recorded: "2024-11-26T09:57:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u.

<ref id="sick_day">Sick-day rules reviewed.</ref>

dapagliflozin: stopped today (euglycemic DKA)

dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-112664",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-112664",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-112664",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
