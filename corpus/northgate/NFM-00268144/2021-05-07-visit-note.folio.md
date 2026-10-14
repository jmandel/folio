---
folio: "0.1"
id: "01F53W7EE0HFGPZ9H1ZNYAJKFP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00268144"
effective: "2021-05-07T09:50:00-05:00"
recorded: "2021-05-07T11:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.

BP 146/86, pulse 67, wt 201 lb.

Labs today: eGFR 50, K 4.8, A1c 8.5%, LDL 50 mg/dL.

A1c 8.5 with CKD: dapagliflozin started 10 mg daily today. BP above goal: chlorthalidone started 12.5 mg daily today.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-050712",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-050712",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-050712",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-050712",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
