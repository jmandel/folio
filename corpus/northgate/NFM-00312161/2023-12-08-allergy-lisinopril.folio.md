---
folio: "0.1"
id: "01HH53S9MG4HWDG1MKPNGVHV7J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00312161"
effective: "2023-12-08T10:22:00-06:00"
recorded: "2023-12-08T10:22:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
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
    "allergy_id": "AL-4877",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "allergy",
    "reactions": ["Angioedema"],
    "severity": "high",
    "onset": { "date": "2023-12-03", "precision": "day" },
    "visit_id": "V-2023-120871"
  }
}
```
