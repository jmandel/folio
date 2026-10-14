---
folio: "0.1"
id: "01GW8803401CDV8962SB3FQ192"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00846917"
effective: "2023-03-23T14:45:00-05:00"
recorded: "2023-03-23T17:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 162/99, pulse 82, wt 146 lb.
Labs today: eGFR 75, K 4.5, UACR 40 mg/g, A1c 8.5%.
Empagliflozin started 10 mg daily today (A1c 8.5). Discussed what to expect with pt.
BP high today, will recheck at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-032371",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-032371",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-032371",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
