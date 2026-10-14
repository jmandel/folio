---
folio: "0.1"
id: "01JBWCSD0G460TQGJ1JV3R3QB9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00135456"
effective: "2024-11-04T14:10:00-06:00"
recorded: "2024-11-04T14:10:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "allergy_id": "AL-4170",
    "action": "add",
    "substance": { "name": "dapagliflozin", "rxnorm": "1488564" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2024-10-25", "precision": "day" },
    "visit_id": "V-2024-110478"
  }
}
```
