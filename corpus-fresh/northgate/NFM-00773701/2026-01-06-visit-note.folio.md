---
folio: "0.1"
id: "01KEADCW00B8ZY0GJ80XZAYRGM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773701"
effective: "2026-01-06T08:50:00-06:00"
recorded: "2026-01-06T13:44:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.

BP 131/78, pulse 62, wt 225 lb.

Labs 1/4: eGFR 59, K 4.2, UACR 455 mg/g, A1c 7.4%.

Reviewed results with pt. Exam unremarkable. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-010664",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-010664",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-010664",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
