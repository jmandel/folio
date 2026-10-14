---
folio: "0.1"
id: "01JV375520MAX91F4P6FTQXXQ4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2025-05-12T10:15:00-05:00"
recorded: "2025-05-12T16:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic DKA, SGLT2 inhibitor-associated. Feels back to baseline.
BP 128/78, pulse 80, wt 184 lb.
Empagliflozin stopped today (euglycemic DKA). Empagliflozin adverse reaction: euglycemic diabetic ketoacidosis, entered in allergy list.
Pt told not to restart it.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-051265",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-051265",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-051265",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
