---
folio: "0.1"
id: "01JCGRDX98E6RHXQAQPDH4AFAX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2024-11-12T09:30:00-06:00"
recorded: "2024-11-12T11:58:33-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "TODO"
---
Hosp f/u. Riverside 11/2–11/5, euglycemic DKA. Feels back to baseline, eating and drinking normally.

Empagliflozin stopped, entered as adverse reaction. Metformin and chlorthalidone continue per discharge.

<ref id="sick_day">sick day rules reviewed</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-111203",
    "visit_type": "office",
    "reason": "Hosp f/u",
    "billing_dx": [
      { "icd10cm": "Z09", "display": "Follow-up exam after completed treatment" },
      { "icd10cm": "E11.22", "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease" },
      { "icd10cm": "N18.31", "display": "Chronic kidney disease, stage 3a" }
    ]
  }
}
```
