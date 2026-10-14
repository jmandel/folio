---
folio: "0.1"
id: "01H3WJC2R06TTC9QVWH7FZACZC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00272471"
effective: "2023-06-26T12:50:00-05:00"
recorded: "2023-06-26T14:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Lip and tongue swelling has settled, breathing normal.
Lisinopril allergy: angioedema of lips and tongue. Lisinopril stopped today (angioedema).
Amlodipine dose changed to 10 mg daily today, replacing lisinopril.
Pt told to avoid ACE inhibitors and to go to the ED if swelling returns.
RTC 1 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-062695",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-062695",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
