---
folio: "0.1"
id: "01DZY656FG6YXNP70H47RPXEYN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00160060"
effective: "2020-01-31T10:15:00-06:00"
recorded: "2020-01-31T10:15:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Lisinopril: angioedema of lips and tongue.</ref> Seen in ED.

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-2604",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2020-01-21", "precision": "day" },
    "visit_id": "V-2020-013137"
  }
}
```
