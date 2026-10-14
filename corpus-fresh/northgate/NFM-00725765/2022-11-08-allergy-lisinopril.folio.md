---
folio: "0.1"
id: "01GHC08X9GQPZRG4S59W1ZHHBH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00725765"
effective: "2022-11-08T10:13:00-06:00"
recorded: "2022-11-08T10:13:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Dry cough on lisinopril.</ref> Cough only with the ACE inhibitor: no lip, tongue or throat swelling (not angioedema).

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-3131",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "intolerance",
    "reactions": ["Cough"],
    "severity": "low",
    "onset": { "date": "2022-08-01", "precision": "month" },
    "visit_id": "V-2022-110853"
  }
}
```
