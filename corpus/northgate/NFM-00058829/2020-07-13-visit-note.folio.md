---
folio: "0.1"
id: "01ED5856K0PFC5ZCAHAJ98YB7Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00058829"
effective: "2020-07-13T15:10:00-05:00"
recorded: "2020-07-13T18:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 155/94, repeat 148/90, pulse 86, wt 226 lb.
Labs 7/9: eGFR 70, K 4.4, A1c 6.6%, LDL 158 mg/dL.
BP above goal, lisinopril dose changed to 40 mg daily today.
Recheck BP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-071361",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-071361",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
