---
folio: "0.1"
id: "01KMGQ4TW0FK2R6EDPKG17G2CW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00531772"
effective: "2026-03-24T11:10:00-05:00"
recorded: "2026-03-24T15:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

metformin: stopped today (eGFR 30)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-032473",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-032473",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
