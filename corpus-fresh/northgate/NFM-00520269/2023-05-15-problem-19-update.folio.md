---
folio: "0.1"
id: "01H0FWCXE0XEWKK4AXTJ9Y5AJZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00520269"
effective: "2023-05-15"
recorded: "2023-05-15T09:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">CKD now stage 3b. eGFR 47 on 1/3 and 44 today, UACR 623 mg/g today.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18779",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2021-04-12", "precision": "day" },
    "visit_id": "V-2023-051571"
  }
}
```
