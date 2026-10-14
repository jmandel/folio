---
folio: "0.1"
id: "01KQA83XB0YGJHDXEA9NF4GM44"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2026-04-28"
recorded: "2026-04-28T09:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">CKD updated to stage 3b. eGFR 42 on 1/23, 37 today. UACR 663 mg/g on 1/23.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19303",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2020-12-02", "precision": "day" },
    "visit_id": "V-2026-042817"
  }
}
```
