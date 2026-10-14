---
folio: "0.1"
id: "01KQ0JS7H059AZBXS1ANPKWC37"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00047094"
effective: "2026-04-24T12:40:00-05:00"
recorded: "2026-04-24T15:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well, no new complaints.
BP 139/86, pulse 64, wt 275 lb.
Labs 4/21: eGFR 86, K 4.1. Reviewed with pt.
Wt stable. Will continue to follow BP.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-042466",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-042466",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
