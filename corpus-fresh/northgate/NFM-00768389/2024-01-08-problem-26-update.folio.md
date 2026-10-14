---
folio: "0.1"
id: "01HKMWDXV0YSRWZ2QZB6E19NV9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00768389"
effective: "2024-01-08"
recorded: "2024-01-08T09:53:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">CKD updated to stage 3b. eGFR 45 on 10/16/23 and 43 today; UACR 75 mg/g on 5/23/23.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18787",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2020-04-22", "precision": "day" },
    "visit_id": "V-2024-010856"
  }
}
```
