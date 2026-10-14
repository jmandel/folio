---
folio: "0.1"
id: "01E0GQD0X0EFA0PXX2HQ1NDAK7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2020-02-07T12:40:00-06:00"
recorded: "2020-02-07T15:03:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 144/91, repeat 141/90. Pulse 65, wt 193 lb.
Labs 2/5: eGFR 68, K 4.1, A1c 7%.
Chlorthalidone started 12.5 mg daily today (BP above goal).
Pt agrees with plan. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-020781",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-020781",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-020781",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
