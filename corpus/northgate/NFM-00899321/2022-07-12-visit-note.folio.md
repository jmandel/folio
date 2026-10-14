---
folio: "0.1"
id: "01G7TM30G05WJ155MP6TR2AH93"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00899321"
effective: "2022-07-12T14:40:00-05:00"
recorded: "2022-07-12T20:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Doing well, no complaints.
BP 135/77, pulse 71, wt 216 lb.
eGFR 79, K 4.5 today.
Wt stable. Continue current plan.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-071224",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-071224",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
