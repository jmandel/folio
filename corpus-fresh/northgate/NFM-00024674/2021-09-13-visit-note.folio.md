---
folio: "0.1"
id: "01FFGN0HX04SVHNKQDYEPNR6P8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00024674"
effective: "2021-09-13T11:15:00-05:00"
recorded: "2021-09-13T17:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. BP 143/81, pulse 88, wt 176 lb.
Labs 9/7: eGFR 76, K 4.5, A1c 7.2%.
BP still above goal. Amlodipine started 5 mg daily today.
RTC 2 mo for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-091328",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-091328",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-091328",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
