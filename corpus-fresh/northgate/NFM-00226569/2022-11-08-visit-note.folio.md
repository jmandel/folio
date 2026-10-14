---
folio: "0.1"
id: "01GHCCG6S0E2SWG6K2G5F9W86B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00226569"
effective: "2022-11-08T11:45:00-06:00"
recorded: "2022-11-08T13:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 125/79, pulse 72, wt 174 lb.

Labs today: eGFR 43, K 4.2, A1c 7.7%, LDL 139.

Dapagliflozin started today, 10 mg daily, for CKD + DM, cardiorenal benefit. Pt understands.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-110828",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-110828",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-110828",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
