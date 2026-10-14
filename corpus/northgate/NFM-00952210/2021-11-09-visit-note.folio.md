---
folio: "0.1"
id: "01FM3EMN003T6F9KSC9KVD48RY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00952210"
effective: "2021-11-09T12:20:00-06:00"
recorded: "2021-11-09T16:56:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u visit. Doing well, no new symptoms.

BP 117/68, pulse 62, wt 151 lb.
Labs 11/7: eGFR 76, LDL 130 mg/dL. Went over results with pt.
Diet and exercise discussed. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-110934",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-110934",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
