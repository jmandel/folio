---
folio: "0.1"
id: "01JXJCB7CGDKRCFE97WSR0J8N4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785866"
effective: "2025-06-12T10:32:00-05:00"
recorded: "2025-06-12T10:32:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.1. Insulin glargine up to 14 units at bedtime.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-23875",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 14, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 14 units under the skin at bedtime",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2025-061242"
  }
}
```
