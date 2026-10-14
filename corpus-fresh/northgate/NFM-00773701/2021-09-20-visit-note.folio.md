---
folio: "0.1"
id: "01FG2DHXD0D5PZWJHVEB0T4R4E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773701"
effective: "2021-09-20T08:50:00-05:00"
recorded: "2021-09-20T15:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 147/86, pulse 76, wt 224 lb.

Labs 9/18: eGFR 71, K 4.4, UACR 357 mg/g, A1c 7.1%.

BP above goal, chlorthalidone started 12.5 mg daily today.

Recheck BMP at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-092011",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-092011",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
