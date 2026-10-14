---
folio: "0.1"
id: "01JKGZ2T0GFKVA9V2SZC4VFBFQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00623675"
effective: "2025-02-07T13:44:00-06:00"
recorded: "2025-02-07T13:44:42-06:00"
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
    "med_id": "ML-12308",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "furosemide 40 MG Oral Tablet", "rxnorm": "313988" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily"
  }
}
```
