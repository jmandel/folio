---
folio: "0.1"
id: "01GHC262AGMPYSB3MRQX1B19RX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00984511"
effective: "2022-11-08T10:46:00-06:00"
recorded: "2022-11-08T10:46:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-23713",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "atorvastatin 40 MG Oral Tablet", "rxnorm": "617311" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime",
    "visit_id": "V-2022-110852"
  }
}
```
