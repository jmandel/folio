---
folio: "0.1"
id: "01HS91VAX06TYTZXQ9B64QW6B7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00422231"
effective: "2024-03-18T08:15:00-05:00"
recorded: "2024-03-18T10:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 136/80, pulse 82, wt 180 lb.

Labs today: eGFR 74, K 4, UACR 144 mg/g, A1c 6.8%, LDL 86 mg/dL.

A1c above goal, so dapagliflozin started 10 mg daily today. Reviewed what to expect with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-031898",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-031898",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-031898",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
