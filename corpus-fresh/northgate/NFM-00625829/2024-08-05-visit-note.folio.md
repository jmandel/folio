---
folio: "0.1"
id: "01J4HVAX100NGWWTRT0KXS8N03"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625829"
effective: "2024-08-05T08:45:00-05:00"
recorded: "2024-08-05T13:03:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.

BP 127/85, pulse 84, wt 177 lb.

Labs today: eGFR 58, K 4.2, UACR 12 mg/g, A1c 7.2%.

BP and A1c acceptable. Will watch eGFR trend. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-080516",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-080516",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
