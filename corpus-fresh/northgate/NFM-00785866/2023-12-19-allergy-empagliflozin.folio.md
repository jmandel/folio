---
folio: "0.1"
id: "01HJ1WXKTGMHPFW8VKR2B03T3C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785866"
effective: "2023-12-19T14:40:00-06:00"
recorded: "2023-12-19T14:40:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Empagliflozin, euglycemic DKA.</ref> Entered as adverse reaction.

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-3358",
    "action": "add",
    "substance": { "name": "empagliflozin", "rxnorm": "1545653" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2023-12-04", "precision": "day" },
    "visit_id": "V-2023-121991"
  }
}
```
