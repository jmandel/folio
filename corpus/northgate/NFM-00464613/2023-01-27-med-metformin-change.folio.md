---
folio: "0.1"
id: "01GQT2V17G8TN9M8MNRZDA5GKV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00464613"
effective: "2023-01-27T11:01:00-06:00"
recorded: "2023-01-27T11:01:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">change metformin: A1c 8.1.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-43142",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2023-012774"
  }
}
```
