---
folio: "0.1"
id: "01H2GR2Z9G4JK8AYFGJEYFTZB1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2023-06-09T13:53:00-05:00"
recorded: "2023-06-09T13:53:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Lisinopril: angioedema of lips and tongue.</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-2543",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2023-06-03", "precision": "day" },
    "visit_id": "V-2023-060958"
  }
}
```
