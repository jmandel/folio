---
folio: "0.1"
id: "01J1DB2ZH06AYY7BNZF0NQRW4M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2024-06-27T09:15:00-05:00"
recorded: "2024-06-27T12:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 139/85, pulse 76, wt 239 lb.

Labs today: eGFR 65, K 4.2, A1c 6.8%.

A1c at goal. BP a bit above goal today, pt to keep home log and bring it next time. RTC 5-6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-062728",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-062728",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
