---
folio: "0.1"
id: "01FM2ZH88047092JJAZSWC1WJN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00764740"
effective: "2021-11-09"
recorded: "2021-11-09T12:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14405",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2019-11-01", "precision": "month" },
    "visit_id": "V-2021-110923"
  }
}
```
