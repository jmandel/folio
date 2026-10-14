---
folio: "0.1"
id: "01KPNV712G8Y2DZ8T18H1DKG6W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00164285"
effective: "2026-04-20T11:22:00-05:00"
recorded: "2026-04-20T11:22:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">resume metformin: eating and drinking normally.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-14165",
    "action": "resume",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "eating and drinking normally"
  }
}
```
