---
folio: "0.1"
id: "01H6RS3X80YE54ZMGFNSKJSRZ5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937830"
effective: "2023-08-01T08:10:00-05:00"
recorded: "2023-08-01T09:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 113/64, pulse 84, wt 207 lb.

Empagliflozin started 10 mg daily today (A1c 8.5, CKD).

Pt voiced understanding. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-080178",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-080178",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
