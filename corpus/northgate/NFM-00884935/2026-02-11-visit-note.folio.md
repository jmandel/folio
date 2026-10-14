---
folio: "0.1"
id: "01KH7G28805V19JYMGMVVABJM5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00884935"
effective: "2026-02-11T14:10:00-06:00"
recorded: "2026-02-11T17:20:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-021188",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-021188",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-021188",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
