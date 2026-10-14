---
folio: "0.1"
id: "01KHPGKEJ05TZBJH738X0TWF93"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00988119"
effective: "2026-02-17T09:00:00-06:00"
recorded: "2026-02-17T13:18:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for euglycemic DKA, SGLT2 inhibitor-associated. Feels back to baseline.
BP 145/78, pulse 66, wt 202 lb.
Empagliflozin: stopped today (euglycemic DKA).
Empagliflozin adverse reaction: euglycemic diabetic ketoacidosis, entered on allergy list.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-021729",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-021729",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-021729",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
