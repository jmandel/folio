---
folio: "0.1"
id: "01GRS5MF50FFF8SG90HTRP5ZG9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00976175"
effective: "2023-02-08"
recorded: "2023-02-08T12:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10124",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2009-01-01", "precision": "year" },
    "visit_id": "V-2023-020821"
  }
}
```
