---
folio: "0.1"
id: "01GDH1Q6W0Q25J5DZ2RX73E8TK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00961755"
effective: "2022-09-21T12:30:00-05:00"
recorded: "2022-09-21T17:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.

BP 129/82, pulse 66, wt 173 lb.

Exam unremarkable. Pt doing well. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-092146",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-092146",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
