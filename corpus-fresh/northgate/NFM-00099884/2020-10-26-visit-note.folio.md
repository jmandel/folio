---
folio: "0.1"
id: "01ENKCCST0BE10EYDFNNM2G194"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00099884"
effective: "2020-10-26T10:00:00-05:00"
recorded: "2020-10-26T16:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx HTN, DM2 and obesity per pt.

BP 140/90, repeat 132/88, pulse 74, wt 209 lb.

Labs from 10/23: eGFR 64, K 4.3, UACR 132 mg/g, A1c 6.6%, LDL 156 mg/dL.

Records requested. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-102617",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-102617",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-102617",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
