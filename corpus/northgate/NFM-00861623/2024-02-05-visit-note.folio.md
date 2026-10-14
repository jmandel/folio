---
folio: "0.1"
id: "01HNXBP7Q0M8P13P67FRTJ37TS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00861623"
effective: "2024-02-05T08:30:00-06:00"
recorded: "2024-02-05T13:25:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.

BP 140/83, repeat 132/81, pulse 84, wt 178 lb.

Today: eGFR 64, K 4.6, UACR 9 mg/g, A1c 7.2%, LDL 48.

Dapagliflozin started 10 mg daily today (CKD + DM, cardiorenal benefit). Counseled on hydration.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-020579",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-020579",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-020579",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
