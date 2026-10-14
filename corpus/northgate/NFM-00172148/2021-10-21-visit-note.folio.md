---
folio: "0.1"
id: "01FJJXYZK094K173JPXJS9BDR4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172148"
effective: "2021-10-21T15:20:00-05:00"
recorded: "2021-10-21T21:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 142/90, repeat 140/89. Pulse 88, wt 148 lb.
Labs today: eGFR 86, K 4.7, A1c 7.6%.
BP above goal, so lisinopril dose changed to 40 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-102155",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-102155",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
