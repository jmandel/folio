---
folio: "0.1"
id: "01JARQ7A4093NMVJYYDTF4H36E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00206105"
effective: "2024-10-21T15:30:00-05:00"
recorded: "2024-10-21T18:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for euglycemic DKA, SGLT2 inhibitor-associated. Feels back to baseline.

BP 138/78, pulse 85, wt 169 lb.

Empagliflozin stopped today and entered as adverse reaction (euglycemic diabetic ketoacidosis).

<ref id="sick_day">Sick-day rules reviewed.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-102165",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-102165",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-102165",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
