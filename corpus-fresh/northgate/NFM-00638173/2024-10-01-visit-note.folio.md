---
folio: "0.1"
id: "01J95556500XE17NVJV9BM632F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00638173"
effective: "2024-10-01T15:30:00-05:00"
recorded: "2024-10-01T18:03:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u. Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated. Feels back to baseline.
BP 140/78, repeat 135/78, pulse 87, wt 248 lb.
Dapagliflozin stopped today (euglycemic DKA).
Entered dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-100174",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-100174",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-100174",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
