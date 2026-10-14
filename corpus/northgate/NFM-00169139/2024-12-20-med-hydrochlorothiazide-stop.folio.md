---
folio: "0.1"
id: "01JFJ7457GS0S2P14Z581THTZD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00169139"
effective: "2024-12-20T08:21:00-06:00"
recorded: "2024-12-20T08:21:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">AKI with hyperkalemia. Hydrochlorothiazide stopped today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-46448",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "hydrochlorothiazide 25 MG Oral Tablet", "rxnorm": "310798" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "AKI with hyperkalemia",
    "visit_id": "V-2024-122073"
  }
}
```
