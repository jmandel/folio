---
folio: "0.1"
id: "01GX3ZSEQGD728AZW759PJBBFX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00277891"
effective: "2023-04-03T11:39:00-05:00"
recorded: "2023-04-03T11:39:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">lisinopril: angioedema of lips and tongue.</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-4243",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2023-03-24", "precision": "day" },
    "visit_id": "V-2023-040364"
  }
}
```
