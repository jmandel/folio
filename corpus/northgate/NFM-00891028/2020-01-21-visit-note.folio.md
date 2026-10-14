---
folio: "0.1"
id: "01DZ5KW460YTTFMQWCBHZH0MTY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00891028"
effective: "2020-01-21T14:50:00-06:00"
recorded: "2020-01-21T21:14:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx per pt.
BP 142/89, repeat 139/87. Pulse 85, wt 250 lb.
Labs 1/18: eGFR 80, K 4.3, LDL 83 mg/dL.
Reviewed labs with pt. Will recheck BP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-012182",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-012182",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
