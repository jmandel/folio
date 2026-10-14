---
folio: "0.1"
id: "01JFTP4JT0WE5F40AKV5T6V1DY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00563235"
effective: "2024-12-23"
recorded: "2024-12-23T15:18:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">CKD now stage 3b. eGFR 46 (2/27), 44 today. UACR 55 mg/g (2/27).</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19593",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2022-10-07", "precision": "day" },
    "visit_id": "V-2024-122382"
  }
}
```
