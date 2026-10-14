---
folio: "0.1"
id: "01JT92H9V0WPSG2CEYGR7G45J7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773673"
effective: "2025-05-02T10:45:00-05:00"
recorded: "2025-05-02T13:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new concerns.
BP 126/80, pulse 66, wt 235 lb.
eGFR 91 today.
Reviewed with pt. Continue diet and exercise.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-050219",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-050219",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
