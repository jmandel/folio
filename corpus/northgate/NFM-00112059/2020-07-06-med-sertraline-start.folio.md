---
folio: "0.1"
id: "01ECJ8EVCG1Y1WVRDTTB9D9SXY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00112059"
effective: "2020-07-06T09:28:00-05:00"
recorded: "2020-07-06T09:28:42-05:00"
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
    "med_id": "ML-11599",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "sertraline 50 MG Oral Tablet", "rxnorm": "312941" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2020-070616"
  }
}
```
