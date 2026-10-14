---
folio: "0.1"
id: "01D1CSCAJ0DHWN6XGAND7AJZKW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00641111"
effective: "2019-01-16T15:10:00-06:00"
recorded: "2019-01-16T20:14:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx HTN, DM2 and obesity per pt.

BP 144/89, repeat 141/86. Pulse 69, wt 217 lb.
Labs today: eGFR 77, K 4.3, A1c 6.6%.

Problem list built from pt history. Will recheck BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-011654",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-011654",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
