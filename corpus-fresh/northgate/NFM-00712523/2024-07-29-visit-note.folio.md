---
folio: "0.1"
id: "01J3ZZ0PB0N9HX4ZRWK0P7QBFR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00712523"
effective: "2024-07-29T12:12:00-05:00"
recorded: "2024-07-29T14:21:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling has resolved, breathing fine, no trouble swallowing.
Lisinopril allergy: angioedema of lips and tongue. Added to allergy list.
Lisinopril: stopped today (angioedema).
Amlodipine: started 5 mg daily today (replacing lisinopril (angioedema)).
Pt to call or go to ED if swelling returns. RTC 2-3 wks for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-072934",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-072934",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
