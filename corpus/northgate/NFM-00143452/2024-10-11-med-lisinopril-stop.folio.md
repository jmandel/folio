---
folio: "0.1"
id: "01J9XYX12GQ7V1GZ4VE9XE9WGE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00143452"
effective: "2024-10-11T09:14:00-05:00"
recorded: "2024-10-11T09:14:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "med_id": "ML-48689",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "lisinopril 10 MG Oral Tablet", "rxnorm": "314076" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "angioedema",
    "visit_id": "V-2024-101167"
  }
}
```
