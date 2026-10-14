---
folio: "0.1"
id: "01DYJXEYR0T2RZ8P7K1QYXVRK3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00226569"
effective: "2020-01-14T10:10:00-06:00"
recorded: "2020-01-14T14:56:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 123/75, pulse 86, wt 177 lb.

1/10 labs: eGFR 51, K 4.3, A1c 8.1%.

A1c 8.1, so dulaglutide started today at 0.5 mg weekly. Pt taught pen use.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-011419",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-011419",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-011419",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
