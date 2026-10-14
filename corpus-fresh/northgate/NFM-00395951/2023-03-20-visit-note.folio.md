---
folio: "0.1"
id: "01GW0ED160A4T1QW4FYQFF62TK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395951"
effective: "2023-03-20T11:34:00-05:00"
recorded: "2023-03-20T16:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u for angioedema. Swelling has settled, breathing and swallowing normal today.

Lisinopril allergy: angioedema of lips and tongue. Lisinopril stopped today (angioedema).

Amlodipine started 10 mg daily today, replacing lisinopril (angioedema).

Pt told to avoid ACE inhibitors and to go to the ED if swelling returns. RTC 4 wk for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-032077",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-032077",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
