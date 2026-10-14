---
folio: "0.1"
id: "01HWDGHTC06NZ5DD1W95NMD37R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00115624"
effective: "2024-04-26"
recorded: "2024-04-26T10:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, onset 9/2018 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11358",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2018-09-01", "precision": "month" },
    "visit_id": "V-2024-042655"
  }
}
```
