---
folio: "0.1"
id: "01HFD7P3Z0X9V8YHPBHPKMR92V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00995828"
effective: "2023-11-16T13:40:00-06:00"
recorded: "2023-11-16T17:33:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx reviewed with pt.
BP 129/76, pulse 87, wt 176 lb.
Labs today: eGFR 97, K 4.6, LDL 92 mg/dL.
Kidney function and K normal.
RTC for f/u, sooner if concerns.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-111671",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-111671",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
