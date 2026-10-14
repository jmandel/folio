---
folio: "0.1"
id: "01J04T7YS099P356JHWB2RJEJ7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00615037"
effective: "2024-06-11T14:29:00-05:00"
recorded: "2024-06-11T18:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling has settled, pt breathing and swallowing normally.
Lisinopril allergy: angioedema of lips and tongue, entered on allergy list.
Lisinopril stopped today (angioedema).
Amlodipine started 10 mg daily today, replacing lisinopril (angioedema).
Pt to call or go to ED if swelling returns. RTC for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-061129",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-061129",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
