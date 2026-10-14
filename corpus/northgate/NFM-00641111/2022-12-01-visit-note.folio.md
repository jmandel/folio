---
folio: "0.1"
id: "01GK7NXZH01VSCDRBZHT3SRA2Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00641111"
effective: "2022-12-01T10:45:00-06:00"
recorded: "2022-12-01T14:27:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 136/84, pulse 74, wt 218 lb.

Labs today: eGFR 76, K 4.7, UACR 7 mg/g, A1c 7.6%, LDL 136 mg/dL.

Pt doing OK, no new complaints. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-120111",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-120111",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-120111",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
