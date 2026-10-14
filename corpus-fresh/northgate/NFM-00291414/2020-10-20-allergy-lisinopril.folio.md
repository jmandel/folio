---
folio: "0.1"
id: "01EN354H3GA9EW06Q23KXCDD8Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2020-10-20T09:03:00-05:00"
recorded: "2020-10-20T09:03:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
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
    "allergy_id": "AL-3882",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "intolerance",
    "reactions": ["Cough"],
    "severity": "low",
    "onset": { "date": "2020-08-01", "precision": "month" },
    "visit_id": "V-2020-102062"
  }
}
```
