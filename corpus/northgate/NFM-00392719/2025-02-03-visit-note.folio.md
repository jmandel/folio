---
folio: "0.1"
id: "01JK6QJCZ063NMWQNP1YKGY13J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2025-02-03T12:00:00-06:00"
recorded: "2025-02-03T14:21:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 124/77, pulse 78, wt 213 lb.

Labs 2/1: eGFR 36, K 4.3, UACR 603 mg/g, A1c 6.6%, LDL 93 mg/dL.

UACR higher than prior. Exam unremarkable.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-020398",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-020398",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-020398",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
