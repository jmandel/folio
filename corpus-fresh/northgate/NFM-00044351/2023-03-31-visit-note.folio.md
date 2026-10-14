---
folio: "0.1"
id: "01GWWE0PJ0XA8GJGB8G4F4CXST"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2023-03-31T10:45:00-05:00"
recorded: "2023-03-31T13:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 130/76, pulse 72, wt 239 lb.

Labs today: eGFR 70, K 4.5, UACR 13 mg/g, A1c 8.4%, LDL 169 mg/dL.

A1c up, metformin dose changed to 1000 mg twice daily today (A1c 8.4). Discussed diet.

RTC 3 mo with repeat A1c.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-033169",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-033169",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-033169",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
