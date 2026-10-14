---
folio: "0.1"
id: "01H2R9J0XGV9QWKCS52DRJBBAN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172148"
effective: "2023-06-12T12:13:00-05:00"
recorded: "2023-06-12T12:13:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">lisinopril: dry cough.</ref> Cough only with the ACE inhibitor: no lip, tongue or throat swelling (not angioedema).

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-2415",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "intolerance",
    "reactions": ["Cough"],
    "severity": "low",
    "onset": { "date": "2023-05-01", "precision": "month" },
    "visit_id": "V-2023-061293"
  }
}
```
