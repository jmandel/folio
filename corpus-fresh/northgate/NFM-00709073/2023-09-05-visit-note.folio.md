---
folio: "0.1"
id: "01H9KR1AG0C8PX6RGJC32HK4B8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00709073"
effective: "2023-09-05T13:40:00-05:00"
recorded: "2023-09-05T17:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no new symptoms.
BP 134/81, pulse 72, wt 231 lb.
Labs 9/3: eGFR 77, K 4.4, A1c 7.3%.
Stable. RTC 4 mo for annual.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-090562",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-090562",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-090562",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
