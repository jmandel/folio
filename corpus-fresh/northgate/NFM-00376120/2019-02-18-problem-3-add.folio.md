---
folio: "0.1"
id: "01D410BB00ZWTCY0PHM8N32RVA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00376120"
effective: "2019-02-18"
recorded: "2019-02-18T13:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hypothyroidism, onset 2010. Per pt, added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13465",
    "action": "add",
    "description": "Hypothyroidism",
    "icd10cm": "E03.9",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2019-021825"
  }
}
```
