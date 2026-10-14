---
folio: "0.1"
id: "01FX13YM404EAWCEK8R926ZDM4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00871242"
effective: "2022-02-28"
recorded: "2022-02-28T15:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary OA of knee, onset 2021 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16284",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2021-01-01", "precision": "year" },
    "visit_id": "V-2022-022878"
  }
}
```
