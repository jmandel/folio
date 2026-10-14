---
folio: "0.1"
id: "01JKW3JTN01TJXBYTZBKFAQ4QG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342977"
effective: "2025-02-11T15:20:00-06:00"
recorded: "2025-02-11T21:35:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well.
BP 128/80, pulse 85, wt 176 lb.
Labs today: eGFR 73, K 4.2, UACR 13 mg/g, A1c 7.2%.
Results reviewed with pt, no changes today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-021114",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-021114",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-021114",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
