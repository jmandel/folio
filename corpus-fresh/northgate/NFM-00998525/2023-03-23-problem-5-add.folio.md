---
folio: "0.1"
id: "01GW85A170QQHX24F0099TE3D2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00998525"
effective: "2023-03-23"
recorded: "2023-03-23T16:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary OA of knee, onset 4/2019 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14902",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2019-04-23", "precision": "day" },
    "visit_id": "V-2023-032378"
  }
}
```
