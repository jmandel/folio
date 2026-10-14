---
folio: "0.1"
id: "01KQDTEBN0WWVE42YGKVS9X2A1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2026-04-29T14:10:00-05:00"
recorded: "2026-04-29T18:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 135/80, pulse 76, wt 213 lb.

Labs 4/23: eGFR 31, K 4.6, UACR 508 mg/g, A1c 8.4%, LDL 120 mg/dL.

A1c a bit better than last visit. eGFR lower. Reviewed results with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-042994",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-042994",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-042994",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
