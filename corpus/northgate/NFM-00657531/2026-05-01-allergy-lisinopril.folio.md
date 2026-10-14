---
folio: "0.1"
id: "01KQJ7X8ZGREX7MNS748S1MCZK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00657531"
effective: "2026-05-01T12:03:00-05:00"
recorded: "2026-05-01T12:03:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Dry cough on lisinopril. Cough only with the ACE inhibitor: no lip, tongue or throat swelling (not angioedema).</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-4117",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "intolerance",
    "reactions": ["Cough"],
    "severity": "low",
    "onset": { "date": "2026-03-01", "precision": "month" },
    "visit_id": "V-2026-050111"
  }
}
```
