---
folio: "0.1"
id: "01H3B5J2Z0AK4T88A112M9RB4T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00168882"
effective: "2023-06-19T14:50:00-05:00"
recorded: "2023-06-19T20:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new complaints.
BP 108/60, pulse 63, wt 137 lb.
Labs 6/15: eGFR 52, K 4.8, A1c 6.9%. CKD stage 3a on problem list.
Reviewed results with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-061959",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-061959",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-061959",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
