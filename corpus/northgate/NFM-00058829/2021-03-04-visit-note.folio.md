---
folio: "0.1"
id: "01EZZRRJE09F6DWKT50PAH14C3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00058829"
effective: "2021-03-04T12:50:00-06:00"
recorded: "2021-03-04T17:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 149/87, repeat 145/86, pulse 73, wt 225 lb.
Labs 2/28: eGFR 68, K 4.3, UACR 77 mg/g, A1c 6.8%.
BP above goal, chlorthalidone started 12.5 mg daily today.
Will recheck BMP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-030432",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-030432",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
