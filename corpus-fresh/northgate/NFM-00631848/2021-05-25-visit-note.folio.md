---
folio: "0.1"
id: "01F6JWQBX0F8XMBBF7JS0HJ4F4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00631848"
effective: "2021-05-25T13:40:00-05:00"
recorded: "2021-05-25T18:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints, exam unremarkable.
BP 121/78, pulse 68, wt 226 lb.
eGFR 75 today.
Reviewed results with pt.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-052515",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-052515",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
