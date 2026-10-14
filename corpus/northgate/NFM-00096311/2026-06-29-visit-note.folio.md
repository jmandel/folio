---
folio: "0.1"
id: "01KWAA4Y904S3C04WNGX206QCF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2026-06-29T09:40:00-05:00"
recorded: "2026-06-29T13:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. BP 135/82, pulse 85, wt 170 lb.

Labs today: eGFR 40, K 5, A1c 7.8%.

eGFR lower than at last check, K at upper end. Pt feels well, no new complaints. Will recheck labs at next visit.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-062926",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-062926",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-062926",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
