---
folio: "0.1"
id: "01F0HCCEW0WW7J9GD040G9EGPB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673395"
effective: "2021-03-11T10:45:00-06:00"
recorded: "2021-03-11T13:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

metformin: dose changed to 1000 mg twice daily today (A1c 8.3)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-031114",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-031114",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
