---
folio: "0.1"
id: "01KDP7NDH0EPG711D8PQAR1EGX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773673"
effective: "2025-12-29T15:15:00-06:00"
recorded: "2025-12-29T17:39:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Doing well overall.
BP 117/70, pulse 74, wt 237 lb.
eGFR 91 today, reviewed with pt.
Wt steady. Encouraged activity.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-122991",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-122991",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
