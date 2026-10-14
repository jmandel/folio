---
folio: "0.1"
id: "01H2V8XV402FR20D0Z7CDP5FX7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00952210"
effective: "2023-06-13T09:50:00-05:00"
recorded: "2023-06-13T16:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Feels well, no new issues.

BP 120/71, pulse 72, wt 150 lb.
Labs today: eGFR 79, LDL 62 mg/dL. Pt pleased with the numbers.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-061316",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-061316",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
