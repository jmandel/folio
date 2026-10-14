---
folio: "0.1"
id: "01GW054D0014BNGP27Y8Z6MM6D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00897936"
effective: "2023-03-20T08:15:00-05:00"
recorded: "2023-03-20T13:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No new complaints.

BP 143/90, repeat 137/90, pulse 67, wt 211 lb.
Labs 3/17: eGFR 71, K 4.6.

Discussed home BP checks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-032039",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-032039",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
