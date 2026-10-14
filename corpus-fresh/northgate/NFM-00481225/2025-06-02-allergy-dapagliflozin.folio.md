---
folio: "0.1"
id: "01JWS53SXG0Y05QSY7NRXXXQY5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00481225"
effective: "2025-06-02T15:25:00-05:00"
recorded: "2025-06-02T15:25:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "allergy_id": "AL-4213",
    "action": "add",
    "substance": { "name": "dapagliflozin", "rxnorm": "1488564" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2025-05-19", "precision": "day" },
    "visit_id": "V-2025-060214"
  }
}
```
