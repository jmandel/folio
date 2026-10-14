---
folio: "0.1"
id: "01JHKG4VE0HGAEWCT3HVBE7TNT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00058829"
effective: "2025-01-14T15:00:00-06:00"
recorded: "2025-01-14T16:50:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "visit_id": "V-2025-011475",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-011475",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-011475",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
