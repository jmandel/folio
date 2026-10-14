---
folio: "0.1"
id: "01HZ0FSH5GFSBSG4T3PBX4FJMW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00070366"
effective: "2024-05-28T15:55:00-05:00"
recorded: "2024-05-28T15:55:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-10481",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "carvedilol 12.5 MG Oral Tablet", "rxnorm": "200032" },
    "dose": { "value": 12.5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily"
  }
}
```
