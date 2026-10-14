---
folio: "0.1"
id: "01GET86C20RVWF1YNGT089H6WD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00650029"
effective: "2022-10-07T15:00:00-05:00"
recorded: "2022-10-07T17:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.
BP 139/85, pulse 75, wt 184 lb.
RTC 3 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-100794",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-100794",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
