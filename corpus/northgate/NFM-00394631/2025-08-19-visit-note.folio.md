---
folio: "0.1"
id: "01K31WHSH0Q07PG97Z8Q9040F0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00394631"
effective: "2025-08-19T09:30:00-05:00"
recorded: "2025-08-19T14:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-081992",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-081992",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-081992",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
