---
folio: "0.1"
id: "01HR853K3081S9T29KBKSZ65XK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00304771"
effective: "2024-03-05T08:15:00-06:00"
recorded: "2024-03-05T14:33:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic DKA. Feels back to baseline, eating and drinking normally.
BP 144/78, repeat 141/74, pulse 63, wt 224 lb.
Dapagliflozin: stopped today (euglycemic DKA). Dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis, added to the list.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-030534",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-030534",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-030534",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
