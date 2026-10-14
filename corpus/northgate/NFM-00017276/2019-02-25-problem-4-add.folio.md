---
folio: "0.1"
id: "01D4JMHHC0CCC13JBH69B8PAEB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00017276"
effective: "2019-02-25"
recorded: "2019-02-25T09:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity added, onset 6/2015 per pt.</ref> History from first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12095",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2015-06-27", "precision": "day" },
    "visit_id": "V-2019-022599"
  }
}
```
