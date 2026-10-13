---
folio: "0.1"
id: "01JCGH7E98RHEM3E2MSH4DMDZS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2024-11-12T09:52:00-06:00"
recorded: "2024-11-12T09:52:41-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "TODO"
---
<ref id="med_1">Euglycemic DKA 11/2024 (Riverside admission). Was held in hospital; stopping.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-30577",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "euglycemic DKA",
    "visit_id": "V-2024-111203"
  }
}
```
