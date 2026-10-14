---
folio: "0.1"
id: "01HGGKXR2GF40WNG4KRS90BF4N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00857814"
effective: "2023-11-30T11:20:00-06:00"
recorded: "2023-11-30T11:20:18-06:00"
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
    "allergy_id": "AL-2188",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2023-11-24", "precision": "day" },
    "visit_id": "V-2023-113042"
  }
}
```
