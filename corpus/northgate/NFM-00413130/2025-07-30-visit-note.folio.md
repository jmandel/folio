---
folio: "0.1"
id: "01K1E9JC20J2VJCK1ZRXS342P6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00413130"
effective: "2025-07-30T11:50:00-05:00"
recorded: "2025-07-30T13:30:00-05:00"
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
BP 131/74, pulse 88, wt 186 lb.
Today: eGFR 83, K 4.2, A1c 7.7%, LDL 55, UACR 423 mg/g.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-073079",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-073079",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-073079",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
