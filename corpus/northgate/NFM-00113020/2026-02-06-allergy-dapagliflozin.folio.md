---
folio: "0.1"
id: "01KGTF7JBGMZQ7JM4HYA2CMR0C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00113020"
effective: "2026-02-06T15:55:00-06:00"
recorded: "2026-02-06T15:55:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">dapagliflozin: euglycemic diabetic ketoacidosis.</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-4281",
    "action": "add",
    "substance": { "name": "dapagliflozin", "rxnorm": "1488564" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2026-01-26", "precision": "day" },
    "visit_id": "V-2026-020641"
  }
}
```
