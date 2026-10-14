---
folio: "0.1"
id: "01G9FSCFEGJBQA9PRK1999K9P7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230551"
effective: "2022-08-02T12:24:00-05:00"
recorded: "2022-08-02T12:24:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Cough only with the ACE inhibitor: no lip, tongue or throat swelling (not angioedema).</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-2446",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "intolerance",
    "reactions": ["Cough"],
    "severity": "low",
    "onset": { "date": "2022-05-01", "precision": "month" },
    "visit_id": "V-2022-080251"
  }
}
```
