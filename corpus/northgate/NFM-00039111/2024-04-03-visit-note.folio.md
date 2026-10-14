---
folio: "0.1"
id: "01HTK1NN40JG90F5G5VWX96BVP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00039111"
effective: "2024-04-03T15:00:00-05:00"
recorded: "2024-04-03T17:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Doing well, no complaints.

BP 139/84, pulse 67, wt 247 lb.

Labs 3/28: eGFR 49, K 4.2, A1c 7.7%, LDL 106 mg/dL.

Empagliflozin started 10 mg daily today (CKD + DM, cardiorenal benefit). RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-040343",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-040343",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-040343",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-040343",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
