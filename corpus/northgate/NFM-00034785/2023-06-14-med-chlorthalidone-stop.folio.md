---
folio: "0.1"
id: "01H2XGHRXG9F999FRC90X9HD33"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00034785"
effective: "2023-06-14T12:51:00-05:00"
recorded: "2023-06-14T12:51:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">stop chlorthalidone: AKI with hyperkalemia.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-44477",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "chlorthalidone 25 MG Oral Tablet", "rxnorm": "197499" },
    "dose": { "value": 12.5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1/2 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "AKI with hyperkalemia",
    "visit_id": "V-2023-061463"
  }
}
```
