---
folio: "0.1"
id: "01K31DNQ50FJAC7SPC9D1C3AW0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00394631"
effective: "2025-08-19"
recorded: "2025-08-19T10:03:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">CKD updated to stage 3b. eGFR 43 on 4/4 and today, UACR 250 mg/g on 4/4.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11301",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2022-12-06", "precision": "day" },
    "visit_id": "V-2025-081965"
  }
}
```
