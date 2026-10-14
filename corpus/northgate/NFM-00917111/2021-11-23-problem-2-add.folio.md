---
folio: "0.1"
id: "01FN6VC6W01PX8Z6FXHJ930JYB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00917111"
effective: "2021-11-23"
recorded: "2021-11-23T10:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, onset 2/2014.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9382",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2014-02-19", "precision": "day" },
    "visit_id": "V-2021-112313"
  }
}
```
