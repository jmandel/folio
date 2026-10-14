---
folio: "0.1"
id: "01GVZZ2VMGCRH965Q8PFXV9HZN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395951"
effective: "2023-03-20T11:54:00-05:00"
recorded: "2023-03-20T11:54:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "allergy_id": "AL-3156",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2023-03-08", "precision": "day" },
    "visit_id": "V-2023-032077"
  }
}
```
