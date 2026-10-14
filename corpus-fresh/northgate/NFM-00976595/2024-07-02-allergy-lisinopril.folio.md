---
folio: "0.1"
id: "01J1T4VPYGDXZSDZW5JT48287D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00976595"
effective: "2024-07-02T11:36:00-05:00"
recorded: "2024-07-02T11:36:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Angioedema of lips and tongue on lisinopril.</ref> Seen in ED.

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-2331",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2024-06-20", "precision": "day" },
    "visit_id": "V-2024-070211"
  }
}
```
