---
folio: "0.1"
id: "01K4QNERJ0GRGXY6DDAZ242TCG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821886"
effective: "2025-09-09T09:45:00-05:00"
recorded: "2025-09-09T11:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic DKA, SGLT2 inhibitor-associated. Pt feels back to baseline.
BP 123/78, pulse 62, wt 185 lb.
Dapagliflozin stopped today, entered as adverse reaction: euglycemic diabetic ketoacidosis.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-090941",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-090941",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-090941",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
