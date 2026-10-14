---
folio: "0.1"
id: "01M0JN8PA0JP9NBG4CDJQYZ3TE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00601519"
effective: "2026-08-21"
recorded: "2026-08-21T12:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">CKD updated to stage 3b. eGFR 33 on 3/30 and 35 today, UACR 234 mg/g today.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14987",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2021-03-31", "precision": "day" },
    "visit_id": "V-2026-082181"
  }
}
```
