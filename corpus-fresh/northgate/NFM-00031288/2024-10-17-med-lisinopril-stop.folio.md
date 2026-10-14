---
folio: "0.1"
id: "01JADYSMRGNS2XGE361FFZ98RV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00031288"
effective: "2024-10-17T14:20:00-05:00"
recorded: "2024-10-17T14:20:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Lisinopril 20 mg stopped, AKI with hyperkalemia.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-21878",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "AKI with hyperkalemia",
    "visit_id": "V-2024-101711"
  }
}
```
