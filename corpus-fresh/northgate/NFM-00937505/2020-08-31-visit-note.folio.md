---
folio: "0.1"
id: "01EH331NR0M25G80YT9ZRXWRJV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937505"
effective: "2020-08-31T09:45:00-05:00"
recorded: "2020-08-31T15:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, no new complaints.
BP 129/70, pulse 88, wt 187 lb.
Labs today: eGFR 67, K 4.3, UACR 14 mg/g, A1c 6.8%.
Stable. Reviewed diet and activity.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-083191",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-083191",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
