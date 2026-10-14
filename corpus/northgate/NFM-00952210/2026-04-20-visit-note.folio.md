---
folio: "0.1"
id: "01KPPEQZ40E1XWX09M0J3MFRW3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00952210"
effective: "2026-04-20T13:45:00-05:00"
recorded: "2026-04-20T17:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. No new complaints, feels well.

BP 129/79, pulse 71, wt 150 lb.
Labs 4/14: eGFR 73, K 4.3, LDL 78 mg/dL. Reviewed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-042031",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-042031",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
