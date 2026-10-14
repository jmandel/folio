---
folio: "0.1"
id: "01FQ5V2RX058QR8QG5CDXPNHK8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00563235"
effective: "2021-12-17T15:30:00-06:00"
recorded: "2021-12-17T21:59:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 118/68, pulse 85, wt 178 lb.
eGFR 51 today, K 4.6.
Records to be requested from prior office.
RTC to review labs and plan.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-121798",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-121798",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
