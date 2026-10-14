---
folio: "0.1"
id: "01JAZMYMX07N9JY2TA3BZFZNY5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258867"
effective: "2024-10-24T09:32:00-05:00"
recorded: "2024-10-24T11:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Lip and tongue swelling has settled, breathing fine today.
Lisinopril allergy: angioedema of lips and tongue. Entered on allergy list.
Lisinopril: stopped today (angioedema).
Amlodipine: started 5 mg daily today (replacing lisinopril (angioedema)).
Pt to return or call if swelling recurs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-102468",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-102468",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
