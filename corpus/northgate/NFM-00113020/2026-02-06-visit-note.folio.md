---
folio: "0.1"
id: "01KGTTN7H0YXKNVBD6ZPRQ97DQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00113020"
effective: "2026-02-06T15:30:00-06:00"
recorded: "2026-02-06T19:15:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u. Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated. Feels back to baseline, eating and drinking normally.
BP 122/78, pulse 62, wt 183 lb.
Dapagliflozin: stopped today (euglycemic DKA). Dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis, entered on allergy list.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-020695",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-020695",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-020695",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
