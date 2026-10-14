---
folio: "0.1"
id: "01D68RMPA8A1F146C38T73CMGR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2019-03-18"
recorded: "2019-03-18T11:02:37-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HTN since about 2014 per pt. On lisinopril.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-09114",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2014-01-01", "precision": "year" },
    "visit_id": "V-2019-031804"
  }
}
```
