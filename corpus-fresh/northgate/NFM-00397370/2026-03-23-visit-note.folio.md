---
folio: "0.1"
id: "01KME2B6Y0VFQ2DAJ8N5WRHY2H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00397370"
effective: "2026-03-23T09:00:00-05:00"
recorded: "2026-03-23T14:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic DKA (SGLT2 inhibitor-associated). Feels back to baseline, eating and drinking normally.

BP 133/78, pulse 68, wt 133 lb.

Empagliflozin stopped today, euglycemic DKA. Entered as adverse reaction: euglycemic diabetic ketoacidosis.

Sick day rules reviewed. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-032386",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-032386",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-032386",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
