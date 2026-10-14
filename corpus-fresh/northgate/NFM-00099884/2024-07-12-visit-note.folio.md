---
folio: "0.1"
id: "01J2MG72N0W7H62K3HFAQ2XAGF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00099884"
effective: "2024-07-12T11:45:00-05:00"
recorded: "2024-07-12T17:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated. Feels back to baseline, eating and drinking normally.

BP 141/78, pulse 88, wt 206 lb.

Dapagliflozin stopped today. Entered as adverse reaction: euglycemic diabetic ketoacidosis.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-071234",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-071234",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-071234",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
