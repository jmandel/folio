---
folio: "0.1"
id: "01HRT3A7C0FHXQTDCJVVN04ZVM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00273200"
effective: "2024-03-12T09:30:00-05:00"
recorded: "2024-03-12T14:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic DKA, SGLT2 inhibitor-associated. Feels back to baseline, eating and drinking normally.
BP 152/78, repeat 147/75, pulse 88, wt 102 lb.
Empagliflozin stopped today for the euglycemic DKA, entered as adverse reaction.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-031244",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-031244",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-031244",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
