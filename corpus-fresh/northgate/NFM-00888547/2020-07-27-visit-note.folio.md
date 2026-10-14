---
folio: "0.1"
id: "01EE97KGM0NXQNYWP7P4EH1372"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00888547"
effective: "2020-07-27T11:25:00-05:00"
recorded: "2020-07-27T17:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Lips and tongue swelling has resolved.

Lisinopril allergy: angioedema of lips and tongue. Lisinopril stopped today (angioedema).
Amlodipine started 5 mg daily today, replacing lisinopril.

Pt to return or call for any new swelling or trouble breathing. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-072741",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-072741",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
