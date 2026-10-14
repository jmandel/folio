---
folio: "0.1"
id: "01G2AY1NSGMKH5673YDN7J7V7F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00399144"
effective: "2022-05-05T15:19:00-05:00"
recorded: "2022-05-05T15:19:42-05:00"
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
    "med_id": "ML-17598",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "24 HR metoprolol succinate 50 MG Extended Release Oral Tablet", "rxnorm": "866436" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily"
  }
}
```
