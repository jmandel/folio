---
folio: "0.1"
id: "01J7Y3WACG1WN5QJYVAYTXPRKX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00727793"
effective: "2024-09-16T14:10:00-05:00"
recorded: "2024-09-16T14:10:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">empagliflozin: euglycemic diabetic ketoacidosis.</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-3901",
    "action": "add",
    "substance": { "name": "empagliflozin", "rxnorm": "1545653" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2024-09-03", "precision": "day" },
    "visit_id": "V-2024-091632"
  }
}
```
