---
folio: "0.1"
id: "01JSJHAP707SM5ZR722ECQE8PE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00539751"
effective: "2025-04-23T15:20:00-05:00"
recorded: "2025-04-23T18:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feeling well, no new complaints.

BP 151/88, repeat 146/85, pulse 71, wt 167 lb.

Labs today: eGFR 66, K 4.5, A1c 7.4%.

Reviewed numbers with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-042355",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-042355",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
