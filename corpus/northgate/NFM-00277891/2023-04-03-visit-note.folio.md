---
folio: "0.1"
id: "01GX4BX310J1NA4CQGW6B5T49V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00277891"
effective: "2023-04-03T11:19:00-05:00"
recorded: "2023-04-03T15:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling has settled, breathing fine, no new symptoms.

Lisinopril allergy: angioedema of lips and tongue, added to allergy list.
Lisinopril: stopped today (angioedema).
Amlodipine: started 5 mg daily today (replacing lisinopril, angioedema).

Pt to call or go to ED if swelling returns. BP recheck in a few weeks.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-040311",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-040311",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
