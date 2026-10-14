---
folio: "0.1"
id: "01GW8J60T0H7MMHQWFFSJCZQGX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00998525"
effective: "2023-03-23T15:45:00-05:00"
recorded: "2023-03-23T20:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt, problem list built from what pt reports.

BP 161/94, repeat 154/93. Pulse 80, wt 233 lb.

BP elevated today on both readings. Will recheck at next visit.

Records requested from prior office. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-032378",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-032378",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
