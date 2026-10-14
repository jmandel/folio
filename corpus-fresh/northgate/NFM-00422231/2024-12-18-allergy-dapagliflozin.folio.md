---
folio: "0.1"
id: "01JFD8HJGGZ6E9HGTWYN5A0EH7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00422231"
effective: "2024-12-18T10:10:00-06:00"
recorded: "2024-12-18T10:10:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Dapagliflozin: euglycemic diabetic ketoacidosis.</ref> Entered as adverse reaction.

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-3868",
    "action": "add",
    "substance": { "name": "dapagliflozin", "rxnorm": "1488564" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2024-12-09", "precision": "day" },
    "visit_id": "V-2024-121836"
  }
}
```
