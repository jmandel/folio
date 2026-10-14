---
folio: "0.1"
id: "01FT9NMQC0JAPHJEQC46RK491T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00884935"
effective: "2022-01-25T14:15:00-06:00"
recorded: "2022-01-25T16:28:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN since 2008 per pt.
BP 143/88, repeat 137/84. Pulse 83, wt 167 lb.
Labs from 1/19: eGFR 64, K 4.3.
Reviewed history and records request. Will recheck BP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-012599",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-012599",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
