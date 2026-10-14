---
folio: "0.1"
id: "01GWA7EQK0ZP3CZ41GQP4KA6KY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00920167"
effective: "2023-03-24T08:50:00-05:00"
recorded: "2023-03-24T11:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 132/84, pulse 68, wt 135 lb.
Labs 3/18: eGFR 66, K 4.7, A1c 6.8%, LDL 83.
BP improved. LDL higher than last, will repeat next visit.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-032421",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-032421",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
