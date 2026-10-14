---
folio: "0.1"
id: "01KJFZPTH09A2WCJ229XGJ4F0S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2026-02-27"
recorded: "2026-02-27T10:43:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">CKD now stage 3b. eGFR 48 on 10/28/25 and 44 today, UACR 257 mg/g today.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19400",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2024-06-12", "precision": "day" },
    "visit_id": "V-2026-022761"
  }
}
```
