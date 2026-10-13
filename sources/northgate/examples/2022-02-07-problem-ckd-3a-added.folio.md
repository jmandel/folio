---
folio: "0.1"
id: "01FVB4MWBGPPG2X7R5JQC42EJ5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2022-02-07"
recorded: "2022-02-07T16:25:10-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "TODO"
---
<ref id="prob_1">eGFR 54, UACR 85 today; eGFR 55 in 9/2021. CKD 3a.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11902",
    "action": "add",
    "description": "Chronic kidney disease stage 3a",
    "icd10cm": "N18.31",
    "snomed": "700378005",
    "onset": { "date": "2022-02-07", "precision": "day" }
  }
}
```
