---
folio: "0.1"
id: "01JFX50AJGJ00WV7GRTZ7ERNQW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00951784"
effective: "2024-12-24T14:16:00-06:00"
recorded: "2024-12-24T14:16:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "allergy_id": "AL-3184",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2024-12-14", "precision": "day" },
    "visit_id": "V-2024-122419"
  }
}
```
