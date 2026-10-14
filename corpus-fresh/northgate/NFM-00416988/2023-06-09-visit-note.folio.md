---
folio: "0.1"
id: "01H2H75TF0SBWZX7XNHFAB8PXX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2023-06-09T13:33:00-05:00"
recorded: "2023-06-09T18:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling has settled, breathing normal, no swelling of lips or tongue now.
Lisinopril allergy: angioedema of lips and tongue. Added to allergy list.
Lisinopril: stopped today (angioedema).
Amlodipine: dose changed to 10 mg daily today (replacing lisinopril). Pt to avoid lisinopril.
RTC 2 wk for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-060958",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-060958",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
