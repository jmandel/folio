---
folio: "0.1"
id: "01HMY2EE901YJ65ESNZ6KK11NZ"
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
<ref id="prob_1">Major depressive disorder, recurrent, mild.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16521",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2020-03-16", "precision": "day" },
    "restricted": "BH",
    "visit_id": "V-2024-012468"
  }
}
```
