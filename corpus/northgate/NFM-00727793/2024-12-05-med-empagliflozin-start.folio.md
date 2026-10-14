---
folio: "0.1"
id: "01JEC3F7EGMPRJ4E4XD319JNFV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00727793"
effective: "2024-12-05T13:06:00-06:00"
recorded: "2024-12-05T13:06:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Start empagliflozin 10 mg daily for HFrEF.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-30148",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "HFrEF",
    "visit_id": "V-2024-120578"
  }
}
```
