---
folio: "0.1"
id: "01HNDQZ2XGG46DG94YV24A3EXB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00164285"
effective: "2024-01-30T11:51:00-06:00"
recorded: "2024-01-30T11:51:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Start amlodipine 5 mg daily.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-13595",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "amlodipine 5 MG Oral Tablet", "rxnorm": "197361" },
    "dose": { "value": 5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2024-013018"
  }
}
```
