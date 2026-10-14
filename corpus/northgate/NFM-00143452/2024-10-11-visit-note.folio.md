---
folio: "0.1"
id: "01J9Y866V07EQ6S5X19Z65P1GE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00143452"
effective: "2024-10-11T08:52:00-05:00"
recorded: "2024-10-11T11:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u for angioedema. Swelling has settled, breathing normal.
Lisinopril allergy: angioedema of lips and tongue. Added to allergy list.
Lisinopril stopped today (angioedema).
Amlodipine started 5 mg daily today, replacing lisinopril (angioedema).
Pt to avoid ACE inhibitors. Return sooner if any swelling recurs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-101185",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-101185",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
