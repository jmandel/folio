---
folio: "0.1"
id: "01HYP34AP0F3GNEAC4W8079EG0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00387375"
effective: "2024-05-24T13:15:00-05:00"
recorded: "2024-05-24T15:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. No new concerns.
BP 127/80, pulse 86, wt 179 lb.
Labs 5/19: eGFR 84, K 3.9.
Results discussed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-052447",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-052447",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
