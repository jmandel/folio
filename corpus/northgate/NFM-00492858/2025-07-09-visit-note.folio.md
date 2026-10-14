---
folio: "0.1"
id: "01JZR6Y430W7P5B8JF5PYCY3VY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00492858"
effective: "2025-07-09T08:10:00-05:00"
recorded: "2025-07-09T13:25:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 150/91, pulse 64, wt 184 lb.
Labs today: eGFR 79, K 4.3, A1c 7.1%.
Losartan: dose changed to 100 mg daily today (BP above goal).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-070928",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-070928",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-070928",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
