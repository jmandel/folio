---
folio: "0.1"
id: "01J83K6420ZW76BBWKTMZDSEBQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2024-09-18T14:15:00-05:00"
recorded: "2024-09-18T17:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 144/88, repeat 136/84, pulse 65, wt 212 lb.

eGFR 37, K 4.6, UACR 363 mg/g, A1c 6.9% today.

Repeat BP better. Pt doing well, no new complaints.

RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-091895",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-091895",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-091895",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
