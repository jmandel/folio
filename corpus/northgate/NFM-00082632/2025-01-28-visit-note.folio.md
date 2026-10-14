---
folio: "0.1"
id: "01JJQN13W0YSFRDBT1K7EZ2BX5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00082632"
effective: "2025-01-28T12:52:00-06:00"
recorded: "2025-01-28T17:48:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Lips and tongue swelling has settled per pt.
Lisinopril allergy: angioedema of lips and tongue, added to allergy list.
Lisinopril stopped today (angioedema).
Amlodipine started 5 mg daily today (replacing lisinopril, angioedema).
Pt to avoid lisinopril going forward. RTC 4 wk for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-012839",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-012839",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
