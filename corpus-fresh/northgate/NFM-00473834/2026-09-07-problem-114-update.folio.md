---
folio: "0.1"
id: "01M1YD5ED0XBJAPP9YFVSWZHJX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00473834"
effective: "2026-09-07"
recorded: "2026-09-07T12:03:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">CKD now stage 3b. eGFR 38 on 9/4, 37 today, UACR 715 mg/g on 9/4.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16473",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2024-12-13", "precision": "day" },
    "visit_id": "V-2026-090764"
  }
}
```
