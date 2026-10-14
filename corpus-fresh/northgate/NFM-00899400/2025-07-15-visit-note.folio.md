---
folio: "0.1"
id: "01K07JP6S0H2YT6W0997G6EART"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00899400"
effective: "2025-07-15T11:00:00-05:00"
recorded: "2025-07-15T12:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic DKA (SGLT2 inhibitor-associated). Feels back to baseline, eating and drinking normally.
BP 131/78, pulse 65, wt 237 lb.
Dapagliflozin stopped today (euglycemic DKA). Entered as adverse reaction: dapagliflozin adverse reaction, euglycemic diabetic ketoacidosis.
Pt understands not to restart it.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-071522",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-071522",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-071522",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
