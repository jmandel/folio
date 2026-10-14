---
folio: "0.1"
id: "01EAWWKXA03CJF42D1DS6C6M6J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00396807"
effective: "2020-06-15T09:45:00-05:00"
recorded: "2020-06-15T16:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feeling well, no new complaints.
BP 146/89, pulse 69, wt 227 lb.
Labs today: eGFR 67, K 4.2, A1c 6.8%, LDL 91 mg/dL.
BP above goal today, will recheck next visit. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-061527",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-061527",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
