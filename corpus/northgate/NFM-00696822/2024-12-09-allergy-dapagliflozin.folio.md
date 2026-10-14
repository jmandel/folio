---
folio: "0.1"
id: "01JENYNRZGPAHYN2PZD1N4TD6V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00696822"
effective: "2024-12-09T08:55:00-06:00"
recorded: "2024-12-09T08:55:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Dapagliflozin: euglycemic DKA.</ref> Entered as adverse reaction.

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-2730",
    "action": "add",
    "substance": { "name": "dapagliflozin", "rxnorm": "1488564" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2024-11-27", "precision": "day" },
    "visit_id": "V-2024-120978"
  }
}
```
