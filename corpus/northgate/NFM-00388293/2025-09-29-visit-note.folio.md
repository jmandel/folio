---
folio: "0.1"
id: "01K6BY4520DVJHE2C77AXATJT1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00388293"
effective: "2025-09-29T15:00:00-05:00"
recorded: "2025-09-29T18:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new symptoms.
BP 125/78, pulse 82, wt 163 lb.
9/24 labs: eGFR 70, K 4.4, A1c 7.8%, LDL 95.
A1c still trending up; discussed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-092916",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-092916",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
