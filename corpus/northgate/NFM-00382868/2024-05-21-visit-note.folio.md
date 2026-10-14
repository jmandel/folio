---
folio: "0.1"
id: "01HYERPG30CT9ES2N955B43V81"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00382868"
effective: "2024-05-21T12:30:00-05:00"
recorded: "2024-05-21T18:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new concerns.
BP 135/82, pulse 76, wt 203 lb.
Labs today: eGFR 80, A1c 6.5%.
Results reviewed with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-052146",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-052146",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
