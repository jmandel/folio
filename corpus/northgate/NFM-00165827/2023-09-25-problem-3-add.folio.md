---
folio: "0.1"
id: "01HB6W2V00Q9SDMVEH996RRQHJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165827"
effective: "2023-09-25"
recorded: "2023-09-25T14:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 2014.</ref> Added to problem list at new pt visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9048",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2014-01-01", "precision": "year" },
    "visit_id": "V-2023-092535"
  }
}
```
