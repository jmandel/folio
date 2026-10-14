---
folio: "0.1"
id: "01H8YX4XXGGB68B2NXNHBRX6FM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900818"
effective: "2023-08-28T15:25:00-05:00"
recorded: "2023-08-28T15:25:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Euglycemic DKA on empagliflozin.</ref> Entered as adverse reaction.

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-4853",
    "action": "add",
    "substance": { "name": "empagliflozin", "rxnorm": "1545653" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2023-08-15", "precision": "day" },
    "visit_id": "V-2023-082813"
  }
}
```
