---
folio: "0.1"
id: "01JFXFEVN0JDWM8DB9NT69PKFF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00951784"
effective: "2024-12-24T13:56:00-06:00"
recorded: "2024-12-24T17:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling has settled.
Lisinopril allergy: angioedema of lips and tongue.
Lisinopril stopped today. Amlodipine started 5 mg daily today, replacing lisinopril (angioedema).
Pt to call or return if any swelling recurs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-122419",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-122419",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
