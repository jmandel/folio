---
folio: "0.1"
id: "01HMY2EE90GCHW5YQA65T8B3WX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201393"
effective: "2024-01-24"
recorded: "2024-01-24T09:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 2019.</ref> Added at first visit, hx per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12073",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "visit_id": "V-2024-012468"
  }
}
```
