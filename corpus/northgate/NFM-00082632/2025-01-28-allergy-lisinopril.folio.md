---
folio: "0.1"
id: "01JJQ589JGX5VXT2HJNYM34JTF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00082632"
effective: "2025-01-28T13:12:00-06:00"
recorded: "2025-01-28T13:12:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "allergy_id": "AL-4130",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2025-01-17", "precision": "day" },
    "visit_id": "V-2025-012839"
  }
}
```
