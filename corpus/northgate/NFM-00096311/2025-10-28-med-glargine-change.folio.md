---
folio: "0.1"
id: "01K8NQPWQG0RN4T13XX0EHPZEF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2025-10-28T10:41:00-05:00"
recorded: "2025-10-28T10:41:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">change insulin glargine: A1c 8.4.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-49420",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 18, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 18 units under the skin at bedtime",
    "reason_text": "A1c 8.4",
    "visit_id": "V-2025-102876"
  }
}
```
