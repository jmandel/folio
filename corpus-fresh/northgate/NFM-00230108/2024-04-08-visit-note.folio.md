---
folio: "0.1"
id: "01HTZP5CB0ZDARR45SB2W8D3QY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230108"
effective: "2024-04-08T09:30:00-05:00"
recorded: "2024-04-08T15:25:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for euglycemic DKA, SGLT2 inhibitor-associated. Feels back to baseline, eating and drinking normally.

BP 127/78, pulse 81, wt 200 lb.

Dapagliflozin stopped today. Entered as adverse reaction, euglycemic diabetic ketoacidosis.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-040843",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-040843",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-040843",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
