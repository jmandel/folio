---
folio: "0.1"
id: "01GG64NKN0YW09Q74WBKWXCB00"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00438305"
effective: "2022-10-24T12:45:00-05:00"
recorded: "2022-10-24T18:19:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Pt doing well, no new complaints.
BP 125/72, pulse 80, wt 215 lb.
Exam unremarkable. Encouraged regular walking.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-102479",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-102479",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-102479",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-102479",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
