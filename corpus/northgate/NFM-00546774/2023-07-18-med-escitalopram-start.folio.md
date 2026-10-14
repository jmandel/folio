---
folio: "0.1"
id: "01H5N4R8TGV4WNRVQE6SQ9Q0ZN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00546774"
effective: "2023-07-18T13:38:00-05:00"
recorded: "2023-07-18T13:38:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "med_id": "ML-16059",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "escitalopram 10 MG Oral Tablet", "rxnorm": "349332" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2023-071841"
  }
}
```
