---
folio: "0.1"
id: "01HR7GXS2GTDJQP7G67EV3YXYM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00304771"
effective: "2024-03-05T08:40:00-06:00"
recorded: "2024-03-05T08:40:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Dapagliflozin: euglycemic diabetic ketoacidosis, entered as adverse reaction.</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-2198",
    "action": "add",
    "substance": { "name": "dapagliflozin", "rxnorm": "1488564" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2024-02-26", "precision": "day" },
    "visit_id": "V-2024-030534"
  }
}
```
