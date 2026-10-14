---
folio: "0.1"
id: "01J6AVJRC0H5BAF55PBWD42ZCW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00877608"
effective: "2024-08-27T11:10:00-05:00"
recorded: "2024-08-27T16:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 141/83, pulse 62, wt 203 lb.
Today eGFR 58, K 4.7, UACR 118 mg/g, A1c 6.9%, LDL 123.
Reviewed labs with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-082745",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-082745",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
