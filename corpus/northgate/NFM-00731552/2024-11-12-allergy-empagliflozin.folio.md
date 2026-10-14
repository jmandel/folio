---
folio: "0.1"
id: "01JCGHC7KGRYX1DZWYB8RTCAM0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2024-11-12T09:55:00-06:00"
recorded: "2024-11-12T09:55:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Euglycemic DKA on empagliflozin, Riverside admission 11/2–11/5/2024.</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-3315",
    "action": "add",
    "substance": { "name": "empagliflozin", "rxnorm": "1545653" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2024-11-01", "precision": "day" },
    "visit_id": "V-2024-111203"
  }
}
```
