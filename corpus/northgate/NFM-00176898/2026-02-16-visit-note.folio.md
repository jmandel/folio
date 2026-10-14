---
folio: "0.1"
id: "01KHMAVCS04YK7FX29SB6MK8BW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00176898"
effective: "2026-02-16T13:45:00-06:00"
recorded: "2026-02-16T16:59:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-021655",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-021655",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
