---
folio: "0.1"
id: "01JEP71V3GH10C53SVSYMNRA2M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00359511"
effective: "2024-12-09T11:21:00-06:00"
recorded: "2024-12-09T11:21:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start insulin glargine: A1c 6.6.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-21110",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 6.6",
    "visit_id": "V-2024-120926"
  }
}
```
