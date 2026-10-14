---
folio: "0.1"
id: "01G895RP0GGCTEH72HJKFJ2DVV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00654690"
effective: "2022-07-18T12:30:00-05:00"
recorded: "2022-07-18T12:30:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Angioedema of lips and tongue on lisinopril.</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-3856",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2022-07-11", "precision": "day" },
    "visit_id": "V-2022-071856"
  }
}
```
