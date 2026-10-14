---
folio: "0.1"
id: "01GMYBAT80ARGX3MF9P3BFZJGB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2022-12-22T14:45:00-06:00"
recorded: "2022-12-22T20:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Lips and tongue swelling has settled, breathing fine.
Lisinopril allergy: angioedema of lips and tongue, entered on allergy list.
Lisinopril: stopped today (angioedema).
Amlodipine: started 5 mg daily today (replacing lisinopril (angioedema)).
Pt to avoid ACE inhibitors, return or call if swelling recurs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-122267",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-122267",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
