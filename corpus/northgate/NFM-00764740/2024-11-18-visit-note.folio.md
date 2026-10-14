---
folio: "0.1"
id: "01JD12MY70S8J377SH47WX4VSE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00764740"
effective: "2024-11-18T14:15:00-06:00"
recorded: "2024-11-18T20:05:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Feels well, no new symptoms.

BP 119/66, pulse 77, wt 210 lb.

Labs today: eGFR 64, K 3.8, LDL 97 mg/dL. Results reviewed with pt.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-111858",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-111858",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
