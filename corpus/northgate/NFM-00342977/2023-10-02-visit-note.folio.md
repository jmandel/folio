---
folio: "0.1"
id: "01HBRR07H0HY0G6CVZ8W5X5A5K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342977"
effective: "2023-10-02T11:15:00-05:00"
recorded: "2023-10-02T12:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. A1c above goal today, so empagliflozin 10 mg daily started today.

BP 131/84, pulse 69, wt 171 lb.

Labs today: eGFR 73, K 4.6, A1c 7.2%, LDL 147 mg/dL.

Pt agrees with plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-100213",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-100213",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-100213",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
