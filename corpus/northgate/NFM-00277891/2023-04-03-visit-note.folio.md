---
folio: "0.1"
id: "01GX4BX310C75FG2VZ3NGXV1EX"
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
ED f/u, angioedema. Lips and tongue were swollen; swelling is better now.

Lisinopril allergy: angioedema of lips and tongue, added to allergy list.
Lisinopril stopped today (angioedema).
Amlodipine started, 10 mg daily today, replacing lisinopril.

Pt told to return or call 911 if swelling comes back.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-040373",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-040373",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
