---
folio: "0.1"
id: "01KMDHBY5G70JA2S1YB364ZF7B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00397370"
effective: "2026-03-23T09:25:00-05:00"
recorded: "2026-03-23T09:25:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
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
    "allergy_id": "AL-3883",
    "action": "add",
    "substance": { "name": "empagliflozin", "rxnorm": "1545653" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2026-03-10", "precision": "day" },
    "visit_id": "V-2026-032386"
  }
}
```
