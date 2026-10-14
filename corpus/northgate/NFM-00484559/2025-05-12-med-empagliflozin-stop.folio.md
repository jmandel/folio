---
folio: "0.1"
id: "01JV2JA3BGVH5REN0SMZPHFK2N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2025-05-12T10:37:00-05:00"
recorded: "2025-05-12T10:37:42-05:00"
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
    "med_id": "ML-48953",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "euglycemic DKA",
    "visit_id": "V-2025-051215"
  }
}
```
