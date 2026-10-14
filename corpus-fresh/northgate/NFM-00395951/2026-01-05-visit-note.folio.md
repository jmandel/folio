---
folio: "0.1"
id: "01KE80S2Z05NDPX4J106ZBF305"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395951"
effective: "2026-01-05T12:15:00-06:00"
recorded: "2026-01-05T15:25:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well, no new symptoms.

BP 140/88, repeat 138/88. Pulse 79, wt 123 lb.

Labs today: eGFR 86, K 4.5, A1c 7.1%.

BP above goal, amlodipine continued today.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-010579",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-010579",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
