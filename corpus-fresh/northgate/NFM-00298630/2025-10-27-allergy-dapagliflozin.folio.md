---
folio: "0.1"
id: "01K8K7T0DGPAHH5T02AKAZ0XZE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00298630"
effective: "2025-10-27T11:25:00-05:00"
recorded: "2025-10-27T11:25:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Dapagliflozin, euglycemic diabetic ketoacidosis.</ref> Entered as adverse reaction.

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-4079",
    "action": "add",
    "substance": { "name": "dapagliflozin", "rxnorm": "1488564" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2025-10-09", "precision": "day" },
    "visit_id": "V-2025-102716"
  }
}
```
