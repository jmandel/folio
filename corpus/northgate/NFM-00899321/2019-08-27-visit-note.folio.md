---
folio: "0.1"
id: "01DKAANM30BS8FNC72QKDZDVGM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00899321"
effective: "2019-08-27T12:45:00-05:00"
recorded: "2019-08-27T15:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx reviewed with pt.
BP 132/85, pulse 70, wt 214 lb.
Labs 8/22: eGFR 79, K 4.
Problem list built from pt history today.
RTC to review BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-082796",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-082796",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
