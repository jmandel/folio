---
folio: "0.1"
id: "01KN2HJKZ069FA43RB7KZDFF06"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00277891"
effective: "2026-03-31T10:10:00-05:00"
recorded: "2026-03-31T13:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.

BP 143/90, repeat 141/87, pulse 81, wt 164 lb.
eGFR 68, K 4.1 today.

BP above goal, amlodipine continued today.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-033126",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-033126",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-033126",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
