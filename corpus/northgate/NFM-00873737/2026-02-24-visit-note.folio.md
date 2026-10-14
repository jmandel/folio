---
folio: "0.1"
id: "01KJ9D0WB0RY785MFC3187NF9J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2026-02-24T15:15:00-06:00"
recorded: "2026-02-24T21:21:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 135/80, pulse 80, wt 187 lb.
Labs today: eGFR 43, K 4.4, UACR 1202 mg/g, A1c 7.1%.
eGFR 43, so metformin dose changed to 500 mg twice daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-022472",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-022472",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-022472",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
