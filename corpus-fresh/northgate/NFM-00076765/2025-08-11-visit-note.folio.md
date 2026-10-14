---
folio: "0.1"
id: "01K2DQ757038G8ZZXNZ9DNMGNW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00076765"
effective: "2025-08-11T12:52:00-05:00"
recorded: "2025-08-11T18:25:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling has settled, breathing normally.
Lisinopril allergy entered: angioedema of lips and tongue.
Lisinopril stopped today (angioedema).
Amlodipine started 5 mg daily today, replacing lisinopril (angioedema).
Pt to avoid ACE inhibitors and call or go to ED if swelling returns.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-081163",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-081163",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
