---
folio: "0.1"
id: "01J4S6QA4GVF5WX995FXPCSHST"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00769987"
effective: "2024-08-08T09:36:00-05:00"
recorded: "2024-08-08T09:36:42-05:00"
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
    "med_id": "ML-36897",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "carvedilol 12.5 MG Oral Tablet", "rxnorm": "200032" },
    "dose": { "value": 12.5, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily",
    "visit_id": "V-2024-080853"
  }
}
```
