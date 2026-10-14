---
folio: "0.1"
id: "01JXJCY2X0GR9B608R0DGHFRM2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785866"
effective: "2025-06-12"
recorded: "2025-06-12T10:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">CKD updated to stage 3b. eGFR 47 on 1/24, 45 today, UACR 93 mg/g today.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12027",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2022-10-22", "precision": "day" },
    "visit_id": "V-2025-061242"
  }
}
```
