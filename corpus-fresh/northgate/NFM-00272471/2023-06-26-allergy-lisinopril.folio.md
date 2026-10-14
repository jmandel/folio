---
folio: "0.1"
id: "01H3WECERGJB2ES2JE5C54ZS44"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00272471"
effective: "2023-06-26T13:10:00-05:00"
recorded: "2023-06-26T13:10:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "allergy_id": "AL-3726",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2023-06-16", "precision": "day" },
    "visit_id": "V-2023-062695"
  }
}
```
