---
folio: "0.1"
id: "01FH8GPXDGSQ1F54EB2M6DX9HV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00570381"
effective: "2021-10-05T10:21:00-05:00"
recorded: "2021-10-05T10:21:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Lisinopril allergy: angioedema of lips and tongue.</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-2803",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2021-09-26", "precision": "day" },
    "visit_id": "V-2021-100512"
  }
}
```
