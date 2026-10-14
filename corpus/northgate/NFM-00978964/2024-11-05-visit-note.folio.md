---
folio: "0.1"
id: "01JBYPXWY0CEJNGQ2MVGQSS07M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00978964"
effective: "2024-11-05T08:50:00-06:00"
recorded: "2024-11-05T11:46:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care.
BP 141/93, pulse 72, wt 177 lb.
11/1: eGFR 40, K 5, UACR 398 mg/g.
A1c 6.6% on 11/1.
Started dapagliflozin 10 mg daily today for CKD + DM, cardiorenal benefit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-110522",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-110522",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
