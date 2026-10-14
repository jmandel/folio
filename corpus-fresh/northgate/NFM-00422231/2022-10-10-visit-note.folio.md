---
folio: "0.1"
id: "01GF20RFA0MNAJDCMV06XYZM6J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00422231"
effective: "2022-10-10T13:20:00-05:00"
recorded: "2022-10-10T17:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 131/74, pulse 87, wt 182 lb.

Labs today: eGFR 77, K 4.5, UACR 144 mg/g, A1c 6.6%, LDL 72 mg/dL.

Reviewed history with pt and updated problem list.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-101085",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-101085",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-101085",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
