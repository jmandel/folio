---
folio: "0.1"
id: "01H8ZC0EQ0091ZJHTZAMHKZ46A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927255"
effective: "2023-08-28T15:45:00-05:00"
recorded: "2023-08-28T19:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well, no new complaints.

BP 134/83, pulse 85, wt 181 lb.

Reviewed home routine and diet with pt. Will recheck BP at next visit.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-082857",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-082857",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
