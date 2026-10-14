---
folio: "0.1"
id: "01KJWTP0DGW24ZN8S6R7SV6ZAX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00315133"
effective: "2026-03-04T10:25:00-06:00"
recorded: "2026-03-04T10:25:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Euglycemic DKA on empagliflozin.</ref> Hospitalized, entered as adverse reaction.

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-4580",
    "action": "add",
    "substance": { "name": "empagliflozin", "rxnorm": "1545653" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2026-02-18", "precision": "day" },
    "visit_id": "V-2026-030447"
  }
}
```
