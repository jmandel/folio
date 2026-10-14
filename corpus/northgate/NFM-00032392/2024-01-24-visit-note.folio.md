---
folio: "0.1"
id: "01HMYS1PT0DE59ZKDW64MF391C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00032392"
effective: "2024-01-24T13:20:00-06:00"
recorded: "2024-01-24T16:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Patient ran out of lisinopril about 3 weeks ago and has not been taking it.
BP 143/83, repeat 139/80, pulse 88, wt 198 lb.
1/22 labs: eGFR 87, K 4.2, A1c 7.1%.
Pt understands importance of refills and will call before running out.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-012462",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-012462",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
