---
folio: "0.1"
id: "01HQBCPH1GV6XKZSDC7SJQ873R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00712523"
effective: "2024-02-23T10:27:00-06:00"
recorded: "2024-02-23T10:27:42-06:00"
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
    "med_id": "ML-23389",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "sertraline 50 MG Oral Tablet", "rxnorm": "312941" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2024-022375"
  }
}
```
