---
folio: "0.1"
id: "01KJAY5RC0RPW6FGHHY5VGFP02"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00516657"
effective: "2026-02-25T09:15:00-06:00"
recorded: "2026-02-25T11:40:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new complaints.
BP 147/91, repeat 139/87, pulse 74, wt 185 lb.
Labs 2/23: eGFR 95, K 4.3, LDL 106 mg/dL.
Amlodipine started 5 mg daily today (BP above goal).
RTC 3 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-022595",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-022595",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-022595",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
