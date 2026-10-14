---
folio: "0.1"
id: "01JWSPQ7709TWZBPTAYWS8KEJT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00481225"
effective: "2025-06-02T15:00:00-05:00"
recorded: "2025-06-02T20:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u after admission for euglycemic DKA. Feels back to baseline, eating and drinking normally.

Dapagliflozin stopped today, entered as adverse reaction (euglycemic diabetic ketoacidosis).

BP 142/78, repeat 136/75, pulse 79, wt 223 lb.

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-060214",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-060214",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-060214",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
