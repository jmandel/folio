---
folio: "0.1"
id: "01GX4QEYZ09DCH0TMS9STA6XB0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00473834"
effective: "2023-04-03T13:10:00-05:00"
recorded: "2023-04-03T18:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Labs from 3/30 reviewed.
BP 131/81, pulse 64, wt 233 lb.
eGFR 62, K 5, UACR 301 mg/g, A1c 7.4%, LDL 85.
Albuminuria persists. Nephrology referral placed today. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-040352",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-040352",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-040352",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
