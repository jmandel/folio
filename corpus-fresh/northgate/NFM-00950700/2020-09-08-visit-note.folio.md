---
folio: "0.1"
id: "01EHQWZFT0EF9GZ443GF3H531P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00950700"
effective: "2020-09-08T13:00:00-05:00"
recorded: "2020-09-08T17:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 139/85, pulse 68, wt 142 lb.
eGFR 76, K 4.5, A1c 7.2% today.
A1c improved. Pt doing well, no low sugars reported.
RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-090837",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-090837",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
