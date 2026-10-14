---
folio: "0.1"
id: "01JV3A2HB04EVHJ9EA52YQ4595"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351993"
effective: "2025-05-12T15:15:00-05:00"
recorded: "2025-05-12T17:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

metformin: dose changed to 500 mg twice daily today (eGFR 44)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-051294",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-051294",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-051294",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
