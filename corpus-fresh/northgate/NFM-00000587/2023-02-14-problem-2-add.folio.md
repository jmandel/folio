---
folio: "0.1"
id: "01GS8QQSR0TKXKEEWGC6TZ6FW9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00000587"
effective: "2023-02-14"
recorded: "2023-02-14T13:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes added, dx 2022 per pt.</ref> Entered at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19093",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2022-01-01", "precision": "year" },
    "visit_id": "V-2023-021475"
  }
}
```
