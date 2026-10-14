---
folio: "0.1"
id: "01G0Z368D0FYX8C9YG4BBHEP7C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00891028"
effective: "2022-04-18T10:10:00-05:00"
recorded: "2022-04-18T14:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 124/76, pulse 78, wt 252 lb.
eGFR 80 and K 4.4 today.
BP at goal. No changes today.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-041832",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-041832",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
