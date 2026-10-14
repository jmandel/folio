---
folio: "0.1"
id: "01D3S2VRP0N5E5CPFBEKP3W6R6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00083633"
effective: "2019-02-15"
recorded: "2019-02-15T11:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild. Onset 5/2019.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15548",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "onset": { "date": "2019-05-26", "precision": "day" },
    "restricted": "BH",
    "visit_id": "V-2019-021581"
  }
}
```
