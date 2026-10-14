---
folio: "0.1"
id: "01H8CG9020AP15KHK223S1KK9G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00621637"
effective: "2023-08-21T08:40:00-05:00"
recorded: "2023-08-21T11:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u.

BP 130/74, pulse 80, wt 192 lb.

Labs today: eGFR 62, K 4.8, A1c 8.4%.

Started semaglutide 0.5 mg weekly today (A1c 8.4). Injection technique reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-082175",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-082175",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-082175",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
