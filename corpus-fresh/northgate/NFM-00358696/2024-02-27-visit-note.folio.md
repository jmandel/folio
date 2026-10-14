---
folio: "0.1"
id: "01HQP5DBC0W5GF4N9ABXATAQPW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00358696"
effective: "2024-02-27T10:08:00-06:00"
recorded: "2024-02-27T14:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Lips and tongue swelling has settled, pt feels back to normal.
Lisinopril allergy: angioedema of lips and tongue, entered on allergy list.
Lisinopril stopped today. Amlodipine started 5 mg daily today, replacing lisinopril (angioedema).
Pt to call or go to ED if any swelling returns.
RTC 1 mo for BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-022739",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-022739",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
