---
folio: "0.1"
id: "01FBT88XY0MKJ6FV7B2Y4296GA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00474892"
effective: "2021-07-29T14:20:00-05:00"
recorded: "2021-07-29T18:06:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 116/62, pulse 85, wt 137 lb.
Labs 7/27: eGFR 53, K 4.4, A1c 7.8%.
Empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-072937",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-072937",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-072937",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-072937",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
