---
folio: "0.1"
id: "01HAYS5A90E68B1MPTQH41AK7D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00568295"
effective: "2023-09-22"
recorded: "2023-09-22T10:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 9/2021 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18488",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2021-09-18", "precision": "day" },
    "visit_id": "V-2023-092219"
  }
}
```
