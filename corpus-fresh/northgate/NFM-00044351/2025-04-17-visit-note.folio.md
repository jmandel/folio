---
folio: "0.1"
id: "01JS2XSJS00VZ6EX15NESPRAZX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2025-04-17T14:15:00-05:00"
recorded: "2025-04-17T17:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 130/77, pulse 74, wt 240 lb.

4/15 labs: eGFR 59, K 4.5, UACR 23 mg/g, A1c 6.4%.

eGFR down from last check, UACR a little higher. Will repeat labs at next visit. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-041735",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-041735",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-041735",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
