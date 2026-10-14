---
folio: "0.1"
id: "01J6DAA9C0MS577B9MH4M7KRPZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00181799"
effective: "2024-08-28T09:45:00-05:00"
recorded: "2024-08-28T15:20:00-05:00"
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

BP 105/67, pulse 74, wt 215 lb.

Labs 8/24: eGFR 87, K 4.7, LDL 75 mg/dL.

Records to be requested from prior office. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-082818",
    "visit_type": "office",
    "reason": "New patient, establish care"
  }
}
```
