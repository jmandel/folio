---
folio: "0.1"
id: "01JSJ8XGY0XEE2B91K0N27QGM5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00271285"
effective: "2025-04-23T10:15:00-05:00"
recorded: "2025-04-23T16:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for euglycemic DKA. Feels back to baseline, eating and drinking normally.
BP 137/78, pulse 69, wt 183 lb.
Empagliflozin stopped today (euglycemic DKA). Entered as adverse reaction: euglycemic diabetic ketoacidosis.
<ref id="sick_day">Sick-day rules reviewed.</ref>
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-042346",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-042346",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-042346",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
