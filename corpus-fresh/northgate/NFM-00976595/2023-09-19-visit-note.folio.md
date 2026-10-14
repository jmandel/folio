---
folio: "0.1"
id: "01HAR0T3A0J14SCJ75QPZD9EV5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00976595"
effective: "2023-09-19T14:20:00-05:00"
recorded: "2023-09-19T19:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 140/84, repeat 135/81, pulse 67, wt 140 lb.
eGFR 71, K 4.4 today.
Stable overall. Pt to keep an eye on home BPs.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-091961",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-091961",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
