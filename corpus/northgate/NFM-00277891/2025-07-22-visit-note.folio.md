---
folio: "0.1"
id: "01K0TB7460MQ1JW5CKBE2H666D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00277891"
effective: "2025-07-22T15:15:00-05:00"
recorded: "2025-07-22T19:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 147/88, pulse 77, wt 160 lb.

Labs today: eGFR 67, K 4.2, LDL 116 mg/dL.

BP still above goal. Amlodipine: started 5 mg daily today (BP above goal).
RTC 3 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-072227",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-072227",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-072227",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-072227",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
