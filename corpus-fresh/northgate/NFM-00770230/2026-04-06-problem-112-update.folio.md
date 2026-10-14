---
folio: "0.1"
id: "01KNHKC3B0K8GJQE6B12KSYTX8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770230"
effective: "2026-04-06"
recorded: "2026-04-06T09:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">CKD now stage 3b: eGFR 42 on 12/25/25 and 41 today, UACR 591 mg/g on 12/25/25.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13473",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2024-03-18", "precision": "day" },
    "visit_id": "V-2026-040614"
  }
}
```
