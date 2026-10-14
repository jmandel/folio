---
folio: "0.1"
id: "01EE8JM29GQFYFR2VD99K6QP5H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00888547"
effective: "2020-07-27T11:45:00-05:00"
recorded: "2020-07-27T11:45:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Lisinopril allergy: angioedema of lips and tongue.</ref> Seen in ED.

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-4357",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2020-07-21", "precision": "day" },
    "visit_id": "V-2020-072741"
  }
}
```
