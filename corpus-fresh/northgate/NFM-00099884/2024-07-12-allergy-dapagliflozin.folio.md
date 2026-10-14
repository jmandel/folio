---
folio: "0.1"
id: "01J2KYS54G0A8VMASBYT7ZKFG0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00099884"
effective: "2024-07-12T12:10:00-05:00"
recorded: "2024-07-12T12:10:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "allergy_id": "AL-2211",
    "action": "add",
    "substance": { "name": "dapagliflozin", "rxnorm": "1488564" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2024-06-28", "precision": "day" },
    "visit_id": "V-2024-071234"
  }
}
```
