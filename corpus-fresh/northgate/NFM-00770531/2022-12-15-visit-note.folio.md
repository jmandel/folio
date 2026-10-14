---
folio: "0.1"
id: "01GMC3GJ70ZJSYR1M1DGGS1XBZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770531"
effective: "2022-12-15T12:10:00-06:00"
recorded: "2022-12-15T17:57:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.

BP 130/81, pulse 82, wt 180 lb.
Labs today: eGFR 52, K 4.3, A1c 8.5%, LDL 83.

Empagliflozin started 10 mg daily today (A1c 8.5, CKD).

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-121516",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-121516",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
