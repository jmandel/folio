---
folio: "0.1"
id: "01JATR0280NHQH6FF6CA3N3E5G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00529403"
effective: "2024-10-22"
recorded: "2024-10-22T13:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2022 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16930",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2022-01-01", "precision": "year" },
    "visit_id": "V-2024-102218"
  }
}
```
