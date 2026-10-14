---
folio: "0.1"
id: "01K9QPS8SG39X8JVXBP0XCR0XD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00739733"
effective: "2025-11-10T14:19:00-06:00"
recorded: "2025-11-10T14:19:42-06:00"
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
    "med_id": "ML-29386",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "amlodipine 10 MG Oral Tablet", "rxnorm": "308135" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily"
  }
}
```
