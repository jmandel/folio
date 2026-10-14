---
folio: "0.1"
id: "01GFKEYDB0YNWB73XG5NGQQ0SJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00297636"
effective: "2022-10-17T09:50:00-05:00"
recorded: "2022-10-17T12:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.

BP 132/82, pulse 72, wt 195 lb.
Labs 10/13: eGFR 74, K 4.1, UACR 9 mg/g, A1c 6.5%.

Discussed results with pt. RTC 3–4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-101719",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-101719",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
