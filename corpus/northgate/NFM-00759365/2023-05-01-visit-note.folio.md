---
folio: "0.1"
id: "01GZD1JFD07247C3E4JV9E1150"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2023-05-01T15:30:00-05:00"
recorded: "2023-05-01T20:35:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 136/81, pulse 85, wt 193 lb.
Labs 4/28: eGFR 65, K 4.3, UACR 349 mg/g, A1c 6.9%.
A1c at goal. Seeing nephrology for the kidney side.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-050154",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-050154",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-050154",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
