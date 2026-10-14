---
folio: "0.1"
id: "01DYK1T3W0D3D845T9Z7A5NA33"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00295960"
effective: "2020-01-14T11:45:00-06:00"
recorded: "2020-01-14T16:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. HTN, hyperlipidemia and obesity by pt history.
BP 144/88, pulse 78, wt 242 lb.
Labs 1/12: eGFR 99, K 4.4, LDL 100 mg/dL.
Reviewed history and labs with pt. Will recheck BP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-011493",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-011493",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
