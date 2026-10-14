---
folio: "0.1"
id: "01JWTZFFHGYK8YSQAY82YTNYZ1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00760692"
effective: "2025-06-03T08:25:00-05:00"
recorded: "2025-06-03T08:25:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Euglycemic DKA on dapagliflozin.</ref> Entered as adverse reaction.

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-3210",
    "action": "add",
    "substance": { "name": "dapagliflozin", "rxnorm": "1488564" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2025-05-26", "precision": "day" },
    "visit_id": "V-2025-060324"
  }
}
```
