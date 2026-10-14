---
folio: "0.1"
id: "01G4WZTYCGCANQJTN3JQM4PWPQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00619584"
effective: "2022-06-06T12:08:00-05:00"
recorded: "2022-06-06T12:08:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "med_id": "ML-29949",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "carvedilol 12.5 MG Oral Tablet", "rxnorm": "200032" },
    "dose": { "value": 12.5, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily",
    "visit_id": "V-2022-060626"
  }
}
```
