---
folio: "0.1"
id: "01EKNC1N502YE5E1YSKVCZRPDR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00650029"
effective: "2020-10-02T10:00:00-05:00"
recorded: "2020-10-02T14:19:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u.
BP 142/87, pulse 69, wt 184 lb.
RTC 3 mo for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-100213",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-100213",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
