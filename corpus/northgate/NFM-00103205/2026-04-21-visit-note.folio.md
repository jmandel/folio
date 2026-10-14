---
folio: "0.1"
id: "01KPS45QK0X97KR3VPCSES731J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2026-04-21T15:50:00-05:00"
recorded: "2026-04-21T17:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 131/81, pulse 69, wt 206 lb.
Labs today: eGFR 48, K 4.5, A1c 7.2%.
eGFR down from last check, discussed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-042149",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-042149",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
