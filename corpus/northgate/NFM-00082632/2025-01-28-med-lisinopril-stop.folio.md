---
folio: "0.1"
id: "01JJQ5CP6G2P2J1C65CVY74N4Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00082632"
effective: "2025-01-28T13:14:00-06:00"
recorded: "2025-01-28T13:14:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">stop lisinopril: angioedema.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-18320",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "lisinopril 10 MG Oral Tablet", "rxnorm": "314076" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "angioedema",
    "visit_id": "V-2025-012839"
  }
}
```
