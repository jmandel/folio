---
folio: "0.1"
id: "01JBYEP7E00F7Z1B3SNJSFNXGT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00978964"
effective: "2024-11-05"
recorded: "2024-11-05T09:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN since 2013 per pt. Added to problem list at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19651",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2024-110522"
  }
}
```
