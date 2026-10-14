---
folio: "0.1"
id: "01HNWY027GMBB8K36FZGY0M7C8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00694980"
effective: "2024-02-05T09:25:00-06:00"
recorded: "2024-02-05T09:25:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-48809",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "lisinopril 10 MG Oral Tablet", "rxnorm": "314076" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2024-020585"
  }
}
```
