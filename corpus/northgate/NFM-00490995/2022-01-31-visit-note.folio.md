---
folio: "0.1"
id: "01FTS17A902R73KYK9YKQ1MZE9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00490995"
effective: "2022-01-31T12:30:00-06:00"
recorded: "2022-01-31T15:39:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints.
BP 145/85, repeat 140/81, pulse 77, wt 202 lb.
eGFR 71, K 4.6, UACR 74 mg/g, A1c 6.6% today.
BP above goal, chlorthalidone started 12.5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-013169",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-013169",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-013169",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
