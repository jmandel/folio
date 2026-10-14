---
folio: "0.1"
id: "01FW75YM6G5B49KZK25TPBC1A4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00276077"
effective: "2022-02-18T13:46:00-06:00"
recorded: "2022-02-18T13:46:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-25633",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "hydrochlorothiazide 25 MG Oral Tablet", "rxnorm": "310798" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2022-021842"
  }
}
```
