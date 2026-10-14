---
folio: "0.1"
id: "01JVDJJM20PXM1VETDDZ56R53N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00062738"
effective: "2025-05-16T14:46:00-05:00"
recorded: "2025-05-16T17:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling of lips and tongue has settled, breathing fine.
Lisinopril allergy: angioedema of lips and tongue. Added to allergy list.
Lisinopril stopped today (angioedema).
Amlodipine dose changed to 10 mg daily today, replacing lisinopril (angioedema).
Pt told to avoid this drug class and return or go to ED if swelling recurs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-051621",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-051621",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
