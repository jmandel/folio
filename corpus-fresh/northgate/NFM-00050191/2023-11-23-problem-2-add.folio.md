---
folio: "0.1"
id: "01HFYGC90002G15FPWP5W95M64"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00050191"
effective: "2023-11-23"
recorded: "2023-11-23T10:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia added, onset 2016 per pt.</ref> First visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10992",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2023-112367"
  }
}
```
