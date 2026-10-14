---
folio: "0.1"
id: "01KDNSNBMGA4TDGGZHXK679S9Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00539751"
effective: "2025-12-29T13:34:00-06:00"
recorded: "2025-12-29T13:34:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "allergy_id": "AL-2665",
    "action": "add",
    "substance": { "name": "lisinopril", "rxnorm": "29046" },
    "reaction_type": "intolerance",
    "reactions": ["Cough"],
    "severity": "low",
    "onset": { "date": "2025-10-01", "precision": "month" },
    "visit_id": "V-2025-122955"
  }
}
```
