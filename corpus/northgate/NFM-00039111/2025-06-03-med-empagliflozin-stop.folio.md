---
folio: "0.1"
id: "01JWV2RJTGB3QEB3ANQEEXR6NG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00039111"
effective: "2025-06-03T09:22:00-05:00"
recorded: "2025-06-03T09:22:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">stop empagliflozin: euglycemic DKA.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-43994",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "euglycemic DKA",
    "visit_id": "V-2025-060332"
  }
}
```
