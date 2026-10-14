---
folio: "0.1"
id: "01GRPRVQXG06TD2YCB36VRDBB6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927456"
effective: "2023-02-07T14:25:00-06:00"
recorded: "2023-02-07T14:25:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Euglycemic DKA on empagliflozin.</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-4637",
    "action": "add",
    "substance": { "name": "empagliflozin", "rxnorm": "1545653" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2023-01-23", "precision": "day" },
    "visit_id": "V-2023-020736"
  }
}
```
