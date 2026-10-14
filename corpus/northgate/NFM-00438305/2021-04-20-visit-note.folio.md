---
folio: "0.1"
id: "01F3R8NVF09RD0ZH0GR8J7KWB4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00438305"
effective: "2021-04-20T11:30:00-05:00"
recorded: "2021-04-20T13:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Pt feels well, no new complaints.
BP 141/94, pulse 69, wt 213 lb. BP above goal today.
Discussed home BP checks and bringing the log to next visit.
RTC 1 yr, sooner if BP stays high.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-042028",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-042028",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-042028",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-042028",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
