---
folio: "0.1"
id: "01HNWYXXA05CJJJBXA9XR1KJTF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00694980"
effective: "2024-02-05"
recorded: "2024-02-05T09:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12056",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2021-01-01", "precision": "year" },
    "visit_id": "V-2024-020585"
  }
}
```
