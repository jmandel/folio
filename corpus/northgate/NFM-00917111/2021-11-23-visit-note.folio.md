---
folio: "0.1"
id: "01FN740PH08F5VRZWDGVPE4B4G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00917111"
effective: "2021-11-23T10:20:00-06:00"
recorded: "2021-11-23T13:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 151/93, pulse 62, wt 165 lb.
Labs today: eGFR 81, K 4.2, A1c 7%, LDL 85.
BP above goal today, will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-112313",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-112313",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
