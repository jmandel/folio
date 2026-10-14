---
folio: "0.1"
id: "01D6GGN6301PZZK7J1CHMSZ2B4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00631848"
effective: "2019-03-21"
recorded: "2019-03-21T11:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity added, onset 2004.</ref> Hx per pt, first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9557",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2004-01-01", "precision": "year" },
    "visit_id": "V-2019-032149"
  }
}
```
