---
folio: "0.1"
id: "01GFRDSDK0GCYB0W5XCXT3N5CM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00670731"
effective: "2022-10-19T08:15:00-05:00"
recorded: "2022-10-19T10:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt doing OK overall.
BP 146/85, repeat 138/81. Pulse 75, wt 219 lb.
10/15 labs: eGFR 59, K 4.2, A1c 7.1%.
Reviewed A1c trend and home BP checks with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-101978",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-101978",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
