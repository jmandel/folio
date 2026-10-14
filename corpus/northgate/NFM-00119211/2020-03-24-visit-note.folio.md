---
folio: "0.1"
id: "01E47C5000FMT1AFDJMWPJK0YB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00119211"
effective: "2020-03-24T12:45:00-05:00"
recorded: "2020-03-24T17:56:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt doing well, no new complaints.
BP 123/74, pulse 68, wt 196 lb.
3/22 labs: eGFR 64, UACR 194 mg/g, A1c 7.6%.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-032454",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-032454",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
