---
folio: "0.1"
id: "01KZ6XRRC08F076NR2T33JKC8C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00032392"
effective: "2026-08-04T09:00:00-05:00"
recorded: "2026-08-04T12:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 146/94, pulse 74, wt 197 lb.
7/30 labs: eGFR 81, K 4.9, A1c 7.2%, LDL 134 mg/dL.
Chlorthalidone started 12.5 mg daily today (BP above goal).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-080476",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-080476",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
