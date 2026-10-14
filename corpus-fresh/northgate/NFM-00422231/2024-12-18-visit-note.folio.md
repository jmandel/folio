---
folio: "0.1"
id: "01JFDXDBN07TDPGQNDAEXN0XSA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00422231"
effective: "2024-12-18T09:45:00-06:00"
recorded: "2024-12-18T16:15:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated. BP 129/78, pulse 65, wt 177 lb. Feels back to baseline.

Dapagliflozin stopped today (euglycemic DKA), entered as adverse reaction: euglycemic diabetic ketoacidosis.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-121836",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-121836",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-121836",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
