---
folio: "0.1"
id: "01DZYJYSX0NM3DF9R1S1QG8KKM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00160060"
effective: "2020-01-31T09:55:00-06:00"
recorded: "2020-01-31T13:59:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling of lips and tongue has settled.
Lisinopril allergy: angioedema of lips and tongue. Lisinopril stopped today.
Amlodipine started 5 mg daily today to replace it.
Pt told to go to the ED for any recurrent swelling or trouble breathing.
RTC 4 wk for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-013137",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-013137",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
