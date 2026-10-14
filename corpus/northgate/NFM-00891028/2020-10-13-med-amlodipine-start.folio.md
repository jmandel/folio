---
folio: "0.1"
id: "01EMHWJRPG4HN7FQTA1XTGG0BM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00891028"
effective: "2020-10-13T16:06:00-05:00"
recorded: "2020-10-13T16:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start amlodipine: BP above goal.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-14738",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "amlodipine 5 MG Oral Tablet", "rxnorm": "197361" },
    "dose": { "value": 5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2020-101372"
  }
}
```
