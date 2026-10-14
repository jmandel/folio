---
folio: "0.1"
id: "01HAZ9QRWGHRH2KTGMKWCY5MZQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00359511"
effective: "2023-09-22T15:36:00-05:00"
recorded: "2023-09-22T15:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">change metformin: eGFR 42.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-23439",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "eGFR 42",
    "visit_id": "V-2023-092272"
  }
}
```
