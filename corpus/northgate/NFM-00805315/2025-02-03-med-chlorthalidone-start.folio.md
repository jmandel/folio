---
folio: "0.1"
id: "01JK6PR72GJZYVBAEE3XKGEXA2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00805315"
effective: "2025-02-03T14:06:00-06:00"
recorded: "2025-02-03T14:06:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start chlorthalidone: BP above goal.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-11848",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "chlorthalidone 25 MG Oral Tablet", "rxnorm": "197499" },
    "dose": { "value": 12.5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1/2 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2025-020331"
  }
}
```
